import { DatabaseConnection } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { Referendum } from '../../src/database/models/referendum';
import { VotingDecision } from '../../src/database/models/votingDecision';
import { MimirTransaction } from '../../src/database/models/mimirTransaction';
import { checkForVotes } from '../../src/mimir/checkForVotes';
import { Chain, InternalStatus, Origin, SuggestedVote } from '../../src/types/properties';
import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';

const db = DatabaseConnection.getInstance();

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

describe('Vote Parsing Correctness', () => {
  let testDaoId: number;
  const basePostId = 900000;
  let mockApi: any;
  let mockProvider: any;

  beforeAll(async () => {
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    await db.initialize();

    // Create test DAO
    testDaoId = await DAO.create({
      name: 'Vote Parsing Test DAO ' + Date.now(),
      description: 'Test DAO for vote parsing',
      polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      proposer_mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    });

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
      disconnect: jest.fn(),
    };

    (WsProvider as jest.Mock).mockImplementation(() => mockProvider);
    (ApiPromise.create as jest.Mock).mockResolvedValue(mockApi);
  });

  afterAll(async () => {
    try {
      await db.run('DELETE FROM mimir_transactions WHERE dao_id = ?', [testDaoId]);
      await db.run('DELETE FROM voting_decisions WHERE dao_id = ?', [testDaoId]);
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
    await db.run('DELETE FROM mimir_transactions WHERE dao_id = ?', [testDaoId]);
    await db.run('DELETE FROM voting_decisions WHERE dao_id = ?', [testDaoId]);
    await db.run('DELETE FROM referendums WHERE post_id >= ? AND dao_id = ?', [basePostId, testDaoId]);
    jest.clearAllMocks();
    mockedAxios.post.mockClear();
  });

  async function createTestReferendum(postId: number): Promise<number> {
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

    return referendumId;
  }

  async function verifyVoteStatus(
    postId: number,
    expectedStatus: InternalStatus,
    expectedVote: SuggestedVote
  ): Promise<void> {
    const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
    expect(updatedRef).toBeDefined();
    expect(updatedRef!.internal_status).toBe(expectedStatus);

    const referendumId = updatedRef!.id;
    const decision = await VotingDecision.getByReferendumId(referendumId!, testDaoId);
    expect(decision).toBeDefined();
    expect(decision!.final_vote).toBe(expectedVote);
  }

  describe('Standard Aye Votes', () => {
    it('should correctly parse aye: true as Aye', async () => {
      const postId = basePostId + 1;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: true, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash1',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Standard: { vote: { aye: true }, balance: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedAye, SuggestedVote.Aye);
    });

    it('should correctly parse aye: "true" as Aye', async () => {
      const postId = basePostId + 2;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: 'true', conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedAye, SuggestedVote.Aye);
    });

    it('should correctly parse aye: 1 as Aye', async () => {
      const postId = basePostId + 3;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: 1, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedAye, SuggestedVote.Aye);
    });
  });

  describe('Standard Nay Votes', () => {
    it('should correctly parse aye: false as Nay', async () => {
      const postId = basePostId + 10;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: false, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash2',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Standard: { vote: { aye: false }, balance: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedNay, SuggestedVote.Nay);
    });

    it('should correctly parse aye: "false" as Nay', async () => {
      const postId = basePostId + 11;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: 'false', conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedNay, SuggestedVote.Nay);
    });

    it('should correctly parse aye: 0 as Nay', async () => {
      const postId = basePostId + 12;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: 0, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedNay, SuggestedVote.Nay);
    });
  });

  describe('Abstain Votes (Split)', () => {
    it('should correctly parse Split vote with only abstain as Abstain', async () => {
      const postId = basePostId + 20;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Split: {
                aye: '0',
                nay: '0',
                abstain: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash3',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Split: { aye: 0, nay: 0, abstain: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedAbstain, SuggestedVote.Abstain);
    });

    it('should correctly parse Split vote with numeric 0 for aye/nay as Abstain', async () => {
      const postId = basePostId + 21;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Split: {
                aye: 0,
                nay: 0,
                abstain: 1000000000000
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      await verifyVoteStatus(postId, InternalStatus.VotedAbstain, SuggestedVote.Abstain);
    });

    it('should NOT parse Split vote with aye > 0 as Abstain', async () => {
      const postId = basePostId + 22;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Split: {
                aye: '1000',
                nay: '0',
                abstain: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });
  });

  describe('Edge Cases - Malformed Data', () => {
    it('should handle undefined vote data gracefully', async () => {
      const postId = basePostId + 30;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: undefined,
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should handle null vote data gracefully', async () => {
      const postId = basePostId + 31;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: null,
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should handle missing aye field gracefully', async () => {
      const postId = basePostId + 32;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should handle empty vote object gracefully', async () => {
      const postId = basePostId + 33;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: {},
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should handle string "aye" in vote data (Subscan format)', async () => {
      const postId = basePostId + 34;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: []
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash4',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: 'aye with conviction 1' }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should handle string "nay" in vote data (Subscan format)', async () => {
      const postId = basePostId + 35;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: []
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash5',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: 'nay with conviction 1' }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });
  });

  describe('Aye vs Nay Distinction', () => {
    it('should never parse aye=true as Nay', async () => {
      const postId = basePostId + 40;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: true, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      const decision = await VotingDecision.getByReferendumId(updatedRef!.id!, testDaoId);
      
      expect(updatedRef!.internal_status).not.toBe(InternalStatus.VotedNay);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedAye);
      expect(decision!.final_vote).not.toBe(SuggestedVote.Nay);
      expect(decision!.final_vote).toBe(SuggestedVote.Aye);
    });

    it('should never parse aye=false as Aye', async () => {
      const postId = basePostId + 41;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: false, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: { data: { extrinsics: [] } }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      const decision = await VotingDecision.getByReferendumId(updatedRef!.id!, testDaoId);
      
      expect(updatedRef!.internal_status).not.toBe(InternalStatus.VotedAye);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedNay);
      expect(decision!.final_vote).not.toBe(SuggestedVote.Aye);
      expect(decision!.final_vote).toBe(SuggestedVote.Nay);
    });

    it('should use chain data as source of truth when conflicting with Subscan', async () => {
      const postId = basePostId + 42;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: true, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash6',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Standard: { vote: { aye: false }, balance: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedAye);
    });
  });

  describe('Data Source Priority', () => {
    it('should prioritize chain data over Subscan data', async () => {
      const postId = basePostId + 50;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: [[postId.toString(), {
              Standard: {
                vote: { aye: false, conviction: 1 },
                balance: '1000000000000'
              }
            }]]
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash7',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Standard: { vote: { aye: true }, balance: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.VotedNay);
    });

    it('should use Subscan data when chain data is not available', async () => {
      const postId = basePostId + 51;
      await createTestReferendum(postId);

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: []
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: [{
              extrinsic_hash: '0xhash8',
              call_module: 'ConvictionVoting',
              call_module_function: 'vote',
              params: [
                { name: 'poll_index', value: postId.toString() },
                { name: 'vote', value: { Standard: { vote: { aye: false }, balance: '1000000000000' } } }
              ]
            }]
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should not update when no vote data is available', async () => {
      const postId = basePostId + 52;
      const referendumId = await createTestReferendum(postId);
      
      await VotingDecision.upsert(referendumId, testDaoId, {
        suggested_vote: SuggestedVote.Nay
      });

      mockApi.query.convictionVoting.votingFor.mockResolvedValue({
        toHuman: () => ({
          Casting: {
            votes: []
          }
        })
      });

      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            extrinsics: []
          }
        }
      });

      await checkForVotes();
      
      const updatedRef = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(updatedRef!.internal_status).toBe(InternalStatus.ReadyToVote);
    });
  });
});

