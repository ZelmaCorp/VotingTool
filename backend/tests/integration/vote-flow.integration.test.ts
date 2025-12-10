import { DatabaseConnection } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { Referendum } from '../../src/database/models/referendum';
import { VotingDecision } from '../../src/database/models/votingDecision';
import { MimirTransaction } from '../../src/database/models/mimirTransaction';
import { sendReadyProposalsToMimir } from '../../src/mimir/refreshEndpoint';
import { checkForVotes } from '../../src/mimir/checkForVotes';
import { Chain, InternalStatus, Origin, SuggestedVote } from '../../src/types/properties';
import { multisigService } from '../../src/services/multisig';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import mimirRouter from '../../src/routes/mimir';
import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';

const db = DatabaseConnection.getInstance();

// Mock auth middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Test User' };
    next();
  },
}));

// Mock multisig service
jest.mock('../../src/services/multisig');

// Mock Polkadot API
jest.mock('@polkadot/api', () => {
  const actual = jest.requireActual('@polkadot/api');
  return {
    ...actual,
    ApiPromise: {
      create: jest.fn(),
    },
    WsProvider: jest.fn(),
  };
});

// Mock axios for Subscan API
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for Mimir API
global.fetch = jest.fn() as jest.Mock;

describe('SendToMimir -> Vote Casted Flow Integration Test', () => {
  let app: Express;
  let testDaoId: number;
  const basePostId = 800000;
  let mockApi: any;
  let mockProvider: any;

  beforeAll(async () => {
    // Set encryption key for testing
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    await db.initialize();

    // Mock multisig service
    const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
    mockMultisigService.getMultisigInfo.mockResolvedValue({
      members: [{
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Test Member',
        network: 'Polkadot'
      }],
      threshold: 1
    });
    mockMultisigService.isTeamMember.mockResolvedValue(true);
    mockMultisigService.getCachedTeamMembers.mockResolvedValue([{
      wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      team_member_name: 'Test Member',
      network: 'Polkadot'
    }]);

    // Create test DAO with valid BIP39 mnemonic
    testDaoId = await DAO.create({
      name: 'SendToMimir Test DAO ' + Date.now(),
      description: 'Test DAO for SendToMimir flow',
      polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      proposer_mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    });

    // Set up Express app for endpoint testing
    app = express();
    app.use(bodyParser.json());
    app.use('/', mimirRouter); // Mount at root since router already has /send-to-mimir

    // Set up mock Polkadot API
    mockProvider = {
      disconnect: jest.fn(),
    };
    mockApi = {
      query: {
        convictionVoting: {
          votingFor: jest.fn(),
        },
      },
      tx: {
        convictionVoting: {
          vote: jest.fn(),
        },
      },
      disconnect: jest.fn(),
    };

    (WsProvider as jest.Mock).mockImplementation(() => mockProvider);
    (ApiPromise.create as jest.Mock).mockResolvedValue(mockApi);
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await db.run('DELETE FROM mimir_transactions WHERE dao_id = ?', [testDaoId]);
      await db.run('DELETE FROM voting_decisions WHERE dao_id = ?', [testDaoId]);
      await db.run('DELETE FROM referendum_team_roles WHERE referendum_id IN (SELECT id FROM referendums WHERE dao_id = ?)', [testDaoId]);
      await db.run('DELETE FROM referendums WHERE dao_id = ?', [testDaoId]);
      if (testDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [testDaoId]);
      }
    } catch (error: any) {
      console.log('Cleanup warning:', error?.message || error);
    }
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    // Clean up referendums and transactions before each test
    await db.run('DELETE FROM mimir_transactions WHERE dao_id = ?', [testDaoId]);
    await db.run('DELETE FROM voting_decisions WHERE dao_id = ?', [testDaoId]);
    await db.run('DELETE FROM referendums WHERE post_id >= ? AND dao_id = ?', [basePostId, testDaoId]);
    
    // Reset mocks
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockedAxios.post.mockClear();
  });

  describe('Phase 1: SendToMimir', () => {
    it('should create MimirTransaction records for ReadyToVote referendums', async () => {
      const postId = basePostId + 1;
      
      // Create a referendum with ReadyToVote status
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      // Create voting decision
      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Mock Mimir API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'OK',
      });

      // Mock the tx.convictionVoting.vote method to return a mock method object
      const mockMethod = {
        toHex: jest.fn(() => '0x1234567890abcdef'),
      };
      mockApi.tx.convictionVoting.vote.mockReturnValue({
        method: mockMethod
      });

      // Call sendReadyProposalsToMimir
      await sendReadyProposalsToMimir();

      // Verify MimirTransaction was created
      const transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeDefined();
      expect(transaction!.status).toBe('pending');
      expect(transaction!.calldata).toBeDefined();

      // Verify Mimir API was called
      expect(global.fetch).toHaveBeenCalled();
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain('/transactions/batch');
      expect(fetchCall[1].method).toBe('POST');
    });

    it('should skip referendums that already have pending transactions', async () => {
      const postId = basePostId + 2;
      
      // Create referendum
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Create existing pending transaction
      await MimirTransaction.create(
        referendumId,
        testDaoId,
        '0x123456',
        Date.now(),
        'pending'
      );

      // Mock Mimir API
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'OK',
      });

      // Call sendReadyProposalsToMimir
      await sendReadyProposalsToMimir();

      // Verify Mimir API was NOT called (skipped)
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle multiple referendums with different vote types', async () => {
      const postIds = [basePostId + 10, basePostId + 11, basePostId + 12];
      const votes = [SuggestedVote.Aye, SuggestedVote.Nay, SuggestedVote.Abstain];
      const referendumIds: number[] = [];

      // Create multiple referendums
      for (let i = 0; i < postIds.length; i++) {
        const referendumId = await Referendum.create({
          post_id: postIds[i],
          chain: Chain.Polkadot,
          dao_id: testDaoId,
          title: `Test Referendum ${postIds[i]}`,
          description: 'Test',
          requested_amount_usd: 10000,
          origin: Origin.Root,
          referendum_timeline: 'Voting',
          internal_status: InternalStatus.ReadyToVote,
          link: `https://polkadot.polkassembly.io/referenda/${postIds[i]}`,
          voting_start_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        referendumIds.push(referendumId);

        await VotingDecision.upsert(referendumId, testDaoId, {
          suggested_vote: votes[i]
        });
      }

      // Mock Mimir API responses
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => 'OK',
      });

      // Mock the tx.convictionVoting.vote method to return a mock method object
      const mockMethod = {
        toHex: jest.fn(() => '0x1234567890abcdef'),
      };
      mockApi.tx.convictionVoting.vote.mockReturnValue({
        method: mockMethod
      });

      // Call sendReadyProposalsToMimir
      await sendReadyProposalsToMimir();

      // Verify all transactions were created
      for (let i = 0; i < postIds.length; i++) {
        const transaction = await MimirTransaction.findByPostIdAndChain(postIds[i], Chain.Polkadot, testDaoId);
        expect(transaction).toBeDefined();
        expect(transaction!.status).toBe('pending');
      }

      // Verify Mimir API was called for each referendum
      expect(global.fetch).toHaveBeenCalledTimes(postIds.length);
    });

    it('should handle errors gracefully when Mimir API fails', async () => {
      const postId = basePostId + 20;
      
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Mock Mimir API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Error',
      });

      // Mock the tx.convictionVoting.vote method
      const mockMethod = {
        toHex: jest.fn(() => '0x1234567890abcdef'),
      };
      mockApi.tx.convictionVoting.vote.mockReturnValue({
        method: mockMethod
      });

      // Call should not throw (uses Promise.allSettled internally)
      // But transaction should not be created due to error
      await sendReadyProposalsToMimir();

      // Verify no transaction was created
      const transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeFalsy(); // Returns undefined when not found
    });
  });

  describe('Phase 2: Vote Casted Verification', () => {
    it('should detect votes and update database correctly', async () => {
      const postId = basePostId + 100;
      
      // Create referendum with pending transaction
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Create pending MimirTransaction
      await MimirTransaction.create(
        referendumId,
        testDaoId,
        '0x123456',
        Date.now(),
        'pending'
      );

      // Mock chain data - simulate vote being found
      // fetchActiveVotes iterates over TRACKS, so we need to mock for each track
      const mockVotingResult = {
        toHuman: () => ({
          Casting: {
            votes: [
              [postId.toString(), {
                Standard: {
                  vote: { aye: true, conviction: 1 },
                  balance: '1000000000000'
                }
              }]
            ]
          }
        })
      };

      // Mock for all tracks (TRACKS = [0, 1, 2, 10, 11, 12, 13, 14, 15, 20, 21, 30, 31, 32, 33, 34])
      mockApi.query.convictionVoting.votingFor.mockResolvedValue(mockVotingResult);

      // Mock Subscan API response
      const mockExtrinsic = {
        extrinsic_hash: '0xabcdef123456',
        call_module: 'ConvictionVoting',
        call_module_function: 'vote',
        params: [
          { name: 'poll_index', value: postId.toString() },
          {
            name: 'vote',
            value: {
              Standard: {
                vote: { aye: true, conviction: 1 },
                balance: '1000000000000'
              }
            }
          }
        ]
      };

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [mockExtrinsic]
          }
        }
      });

      // Call checkForVotes
      await checkForVotes();

      // Verify referendum status was updated
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedAye);
      expect(updatedRef!.voted_link).toBeDefined();
      expect(updatedRef!.voted_link).toContain('0xabcdef123456');

      // Verify VotingDecision was updated
      const decision = await VotingDecision.getByReferendumId(referendumId, testDaoId);
      expect(decision!.final_vote).toBe(SuggestedVote.Aye);
      expect(decision!.vote_executed).toBeTruthy(); // SQLite returns 1/0, so use toBeTruthy
      expect(decision!.vote_executed_date).toBeDefined();

      // Verify MimirTransaction status was updated
      // findByPostIdAndChain only finds pending transactions, so it should return null after execution
      const transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeFalsy(); // Should be null or undefined (no pending transaction)

      // Check by referendum_id directly
      const executedTransaction = await db.get(
        'SELECT * FROM mimir_transactions WHERE referendum_id = ? AND dao_id = ?',
        [referendumId, testDaoId]
      );
      expect(executedTransaction).toBeDefined();
      expect(executedTransaction.status).toBe('executed');
      expect(executedTransaction.extrinsic_hash).toBe('0xabcdef123456');
    });

    it('should handle Nay votes correctly', async () => {
      const postId = basePostId + 101;
      
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Nay
      });

      await MimirTransaction.create(
        referendumId,
        testDaoId,
        '0x123456',
        Date.now(),
        'pending'
      );

      // Mock Nay vote
      // fetchActiveVotes iterates over TRACKS, so we need to mock for each track
      const mockVotingResult = {
        toHuman: () => ({
          Casting: {
            votes: [
              [postId.toString(), {
                Standard: {
                  vote: { aye: false, conviction: 1 },
                  balance: '1000000000000'
                }
              }]
            ]
          }
        })
      };

      mockApi.query.convictionVoting.votingFor.mockResolvedValue(mockVotingResult);

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xabcdef123456',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                {
                  name: 'vote',
                  value: {
                    Standard: {
                      vote: { aye: false, conviction: 1 },
                      balance: '1000000000000'
                    }
                  }
                }
              ]
            }]
          }
        }
      });

      await checkForVotes();

      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedNay);
    });

    it('should handle Abstain votes correctly', async () => {
      const postId = basePostId + 102;
      
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Abstain
      });

      await MimirTransaction.create(
        referendumId,
        testDaoId,
        '0x123456',
        Date.now(),
        'pending'
      );

      // Mock Abstain vote (Split vote)
      // fetchActiveVotes iterates over TRACKS, so we need to mock for each track
      const mockVotingResult = {
        toHuman: () => ({
          Casting: {
            votes: [
              [postId.toString(), {
                Split: {
                  aye: '0',
                  nay: '0',
                  abstain: '1000000000000'
                }
              }]
            ]
          }
        })
      };

      mockApi.query.convictionVoting.votingFor.mockResolvedValue(mockVotingResult);

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xabcdef123456',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                {
                  name: 'vote',
                  value: {
                    Split: {
                      aye: 0,
                      nay: 0,
                      abstain: '1000000000000'
                    }
                  }
                }
              ]
            }]
          }
        }
      });

      await checkForVotes();

      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedAbstain);
    });

    it('should not update database when vote is not yet cast', async () => {
      const postId = basePostId + 103;
      
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      await MimirTransaction.create(
        referendumId,
        testDaoId,
        '0x123456',
        Date.now(),
        'pending'
      );

      // Mock no votes found
      // fetchActiveVotes iterates over TRACKS, so we need to mock for each track
      const mockVotingResult = {
        toHuman: () => ({
          Casting: {
            votes: [] // No votes
          }
        })
      };

      mockApi.query.convictionVoting.votingFor.mockResolvedValue(mockVotingResult);

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: []
          }
        }
      });

      await checkForVotes();

      // Verify status is still ReadyToVote
      const ref = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.ReadyToVote);

      // Verify transaction is still pending
      const transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeDefined();
      expect(transaction!.status).toBe('pending');
    });
  });

  describe('Complete Flow: SendToMimir -> Vote Casted', () => {
    it('should complete the full flow from ReadyToVote to VotedAye', async () => {
      const postId = basePostId + 200;
      
      // Step 1: Create referendum with ReadyToVote status
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Step 2: Send to Mimir
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'OK',
      });

      // Mock the tx.convictionVoting.vote method
      const mockMethod = {
        toHex: jest.fn(() => '0x1234567890abcdef'),
      };
      mockApi.tx.convictionVoting.vote.mockReturnValue({
        method: mockMethod
      });

      await sendReadyProposalsToMimir();

      // Verify MimirTransaction was created
      let transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeDefined();
      expect(transaction!.status).toBe('pending');

      // Step 3: Simulate vote being cast on-chain
      // fetchActiveVotes iterates over TRACKS, so we need to mock for each track
      const mockVotingResult = {
        toHuman: () => ({
          Casting: {
            votes: [
              [postId.toString(), {
                Standard: {
                  vote: { aye: true, conviction: 1 },
                  balance: '1000000000000'
                }
              }]
            ]
          }
        })
      };

      mockApi.query.convictionVoting.votingFor.mockResolvedValue(mockVotingResult);

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xabcdef123456',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                {
                  name: 'vote',
                  value: {
                    Standard: {
                      vote: { aye: true, conviction: 1 },
                      balance: '1000000000000'
                    }
                  }
                }
              ]
            }]
          }
        }
      });

      // Step 4: Check for votes
      await checkForVotes();

      // Step 5: Verify complete state
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedAye);
      expect(updatedRef!.voted_link).toBeDefined();

      const decision = await VotingDecision.getByReferendumId(referendumId, testDaoId);
      expect(decision!.final_vote).toBe(SuggestedVote.Aye);
      expect(decision!.vote_executed).toBeTruthy(); // SQLite returns 1/0, so use toBeTruthy

      const executedTransaction = await db.get(
        'SELECT * FROM mimir_transactions WHERE referendum_id = ? AND dao_id = ?',
        [referendumId, testDaoId]
      );
      expect(executedTransaction.status).toBe('executed');
      expect(executedTransaction.extrinsic_hash).toBe('0xabcdef123456');
    });

    it('should handle the endpoint integration', async () => {
      const postId = basePostId + 201;
      
      // Create referendum
      const referendumId = await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: 'Voting',
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Mock Mimir API
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'OK',
      });

      // Mock the tx.convictionVoting.vote method
      const mockMethod = {
        toHex: jest.fn(() => '0x1234567890abcdef'),
      };
      mockApi.tx.convictionVoting.vote.mockReturnValue({
        method: mockMethod
      });

      // Call endpoint
      const response = await request(app)
        .get('/send-to-mimir')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Successfully sent');

      // Verify transaction was created
      const transaction = await MimirTransaction.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(transaction).toBeDefined();
    });
  });
});

