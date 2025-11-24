import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { DatabaseConnection } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { Referendum } from '../../src/database/models/referendum';
import { VotingDecision } from '../../src/database/models/votingDecision';
import { multisigService } from '../../src/services/multisig';
import { Chain } from '../../src/types/properties';
import { InternalStatus, Origin, TimelineStatus, SuggestedVote } from '../../src/types/properties';
import referendumRouter from '../../src/routes/referendums';
import daoRouter from '../../src/routes/dao';
import fs from 'fs';
import path from 'path';

const db = DatabaseConnection.getInstance();

// Mock auth middleware for testing
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' };
    next();
  },
  addDaoContext: (req: any, res: any, next: any) => {
    req.daoId = req.body.daoId || req.params.daoId || 1;
    next();
  },
  requireDaoMembership: (req: any, res: any, next: any) => {
    next();
  },
  requireTeamMember: (req: any, res: any, next: any) => {
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' };
    next();
  }
}));

// Mock the multisig service
jest.mock('../../src/services/multisig');

// Mock signature verification
jest.mock('@polkadot/util-crypto', () => ({
  ...jest.requireActual('@polkadot/util-crypto'),
  signatureVerify: jest.fn(() => ({ isValid: true })),
  mnemonicGenerate: jest.fn(() => 'test test test test test test test test test test test test test test test test test test test test test test test test')
}));

describe('Referendum Voting Workflow Integration Test (Multi-DAO)', () => {
  let app: Express;
  let mockToken: string;
  let testDaoId: number;
  let testReferendumId: number;
  const testPostId = 999999;
  const testChain = Chain.Polkadot;

  beforeAll(async () => {
    // Set encryption key for testing
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // Initialize database for testing
    await db.initialize();
    
    // Check if the database has been migrated to multi-DAO
    const daoTableCheck = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='daos'", []);
    
    if (daoTableCheck.length === 0) {
      console.log('Setting up multi-DAO schema for test database...');
      
      // Manually create daos table and add necessary columns
      await db.run(`
        CREATE TABLE IF NOT EXISTS daos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
          polkadot_multisig_encrypted TEXT,
          kusama_multisig_encrypted TEXT,
          proposer_mnemonic_encrypted TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `, []);
      
      console.log('DAOs table created');
    }
    
    // Ensure dao_id columns exist in all necessary tables
    const tablesToMigrate = [
      'referendums',
      'scoring_criteria', 
      'referendum_team_roles',
      'voting_decisions',
      'discussion_topics',
      'referendum_comments',
      'mimir_transactions',
      'audit_log'
    ];
    
    for (const table of tablesToMigrate) {
      try {
        // Check if column exists by trying to query it
        await db.all(`SELECT dao_id FROM ${table} LIMIT 0`, []);
      } catch (error: any) {
        if (error.message?.includes('no such column')) {
          try {
            console.log(`Adding dao_id column to ${table}...`);
            await db.run(`ALTER TABLE ${table} ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE`, []);
            await db.run(`CREATE INDEX IF NOT EXISTS idx_${table}_dao_id ON ${table}(dao_id)`, []);
          } catch (alterError: any) {
            if (!alterError.message?.includes('duplicate column')) {
              console.warn(`Warning adding dao_id to ${table}:`, alterError.message);
            }
          }
        }
      }
    }
    
    console.log('Multi-DAO schema setup completed');

    // Setup mocks
    const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
    mockMultisigService.getMultisigInfo.mockResolvedValue({
      members: [{
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Alice',
        network: 'Polkadot'
      }, {
        wallet_address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        team_member_name: 'Bob',
        network: 'Polkadot'
      }],
      threshold: 2
    });
    mockMultisigService.isTeamMember.mockResolvedValue(true);
    mockMultisigService.getCachedTeamMembers.mockResolvedValue([
      {
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Alice',
        network: 'Polkadot'
      },
      {
        wallet_address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        team_member_name: 'Bob',
        network: 'Polkadot'
      }
    ]);

    // Create test DAO
    const daoName = 'Voting Workflow Test DAO ' + Date.now();
    testDaoId = await DAO.create({
      name: daoName,
      description: 'Test DAO for voting workflow',
      polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      proposer_mnemonic: 'test test test test test test test test test test test test'
    });

    // Clean up any existing test data
    await db.run('DELETE FROM referendum_team_roles WHERE referendum_id IN (SELECT id FROM referendums WHERE post_id = ? AND chain = ? AND dao_id = ?)', [testPostId, testChain, testDaoId]);
    await db.run('DELETE FROM voting_decisions WHERE referendum_id IN (SELECT id FROM referendums WHERE post_id = ? AND chain = ? AND dao_id = ?)', [testPostId, testChain, testDaoId]);
    await db.run('DELETE FROM referendums WHERE post_id = ? AND chain = ? AND dao_id = ?', [testPostId, testChain, testDaoId]);

    // Create Express app with routes
    app = express();
    app.use(bodyParser.json());
    app.use('/api/referendums', referendumRouter);
    app.use('/api/dao', daoRouter);
    
    mockToken = 'Bearer test-token';
  });

  afterAll(async () => {
    // Cleanup (order matters: delete referendums before DAOs due to foreign key)
    try {
      // Delete all referendum-related data first
      await db.run('DELETE FROM referendum_team_roles WHERE referendum_id IN (SELECT id FROM referendums WHERE dao_id IN (SELECT id FROM daos WHERE name LIKE ?))', ['Voting Workflow Test DAO%']);
      await db.run('DELETE FROM voting_decisions WHERE referendum_id IN (SELECT id FROM referendums WHERE dao_id IN (SELECT id FROM daos WHERE name LIKE ?))', ['Voting Workflow Test DAO%']);
      await db.run('DELETE FROM referendums WHERE dao_id IN (SELECT id FROM daos WHERE name LIKE ?)', ['Voting Workflow Test DAO%']);
      
      // Now safe to delete DAOs
      if (testDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [testDaoId]);
      }
      await db.run('DELETE FROM daos WHERE name LIKE ?', ['Voting Workflow Test DAO%']);
      await db.run('DELETE FROM daos WHERE name LIKE ?', ['Second Test DAO%']);
    } catch (error: any) {
      console.log('Cleanup warning:', error?.message || error);
    }
  });

  describe('Referendum Creation and Lifecycle', () => {
    it('should create a referendum with DAO association', async () => {
      // Create a referendum
      testReferendumId = await Referendum.create({
        post_id: testPostId,
        chain: testChain,
        dao_id: testDaoId,
        title: 'Test Referendum for Voting Workflow',
        description: 'Testing the complete voting workflow',
        requested_amount_usd: 50000,
        origin: Origin.Root,
        referendum_timeline: TimelineStatus.Deciding,
        internal_status: InternalStatus.NotStarted,
        link: `https://polkadot.polkassembly.io/referenda/${testPostId}`,
        voting_start_date: new Date().toISOString(),
        voting_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      expect(testReferendumId).toBeDefined();
      expect(typeof testReferendumId).toBe('number');

      // Verify the referendum exists and has correct DAO association
      const referendum = await Referendum.findByPostIdAndChain(testPostId, testChain, testDaoId);
      expect(referendum).not.toBeNull();
      expect(referendum!.post_id).toBe(testPostId);
      expect(referendum!.chain).toBe(testChain);
      expect(referendum!.dao_id).toBe(testDaoId);
      expect(referendum!.internal_status).toBe(InternalStatus.NotStarted);
    });

    it('should fetch referendums filtered by DAO', async () => {
      // Get all referendums for this DAO
      const referendums = await Referendum.getAll(testDaoId);
      
      expect(Array.isArray(referendums)).toBe(true);
      expect(referendums.length).toBeGreaterThan(0);
      
      // Verify all referendums belong to the correct DAO
      referendums.forEach(ref => {
        expect(ref.dao_id).toBe(testDaoId);
      });
    });

    it('should update referendum status', async () => {
      // Update internal status to Considering
      await Referendum.update(testPostId, testChain, testDaoId, {
        internal_status: InternalStatus.Considering
      });

      const updated = await Referendum.findByPostIdAndChain(testPostId, testChain, testDaoId);
      expect(updated!.internal_status).toBe(InternalStatus.Considering);
    });
  });

  describe('Voting Decision Workflow', () => {
    it('should suggest a vote for referendum', async () => {
      // Suggest Aye vote using VotingDecision model
      await VotingDecision.upsert(testReferendumId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });

      // Update referendum status to ReadyToVote
      await Referendum.update(testPostId, testChain, testDaoId, {
        internal_status: InternalStatus.ReadyToVote
      });

      // Verify voting decision was created
      const decision = await VotingDecision.getByReferendumId(testReferendumId, testDaoId);

      expect(decision).toBeDefined();
      expect(decision!.suggested_vote).toBe(SuggestedVote.Aye);
      expect(decision!.final_vote).toBeNull();

      // Verify referendum status changed to Ready to Vote
      const referendum = await Referendum.findByPostIdAndChain(testPostId, testChain, testDaoId);
      expect(referendum!.internal_status).toBe(InternalStatus.ReadyToVote);
    });

    it('should finalize a vote', async () => {
      // Finalize the vote as Aye
      await VotingDecision.upsert(testReferendumId, testDaoId, {
        final_vote: SuggestedVote.Aye
      });

      // Verify voting decision was updated
      const decision = await VotingDecision.getByReferendumId(testReferendumId, testDaoId);

      expect(decision!.final_vote).toBe(SuggestedVote.Aye);
      expect(decision!.vote_executed).toBeFalsy(); // Not executed yet (SQLite returns 0 for false)
    });

    it('should mark vote as executed', async () => {
      // Mark as executed and update referendum status
      await VotingDecision.upsert(testReferendumId, testDaoId, {
        vote_executed: true,
        vote_executed_date: new Date().toISOString()
      });

      await Referendum.updateVotingStatus(testPostId, testChain, testDaoId, InternalStatus.VotedAye);

      // Verify voting decision
      const decision = await VotingDecision.getByReferendumId(testReferendumId, testDaoId);

      expect(decision!.vote_executed).toBeTruthy(); // SQLite returns 1 for true
      expect(decision!.vote_executed_date).toBeDefined();

      // Verify referendum status
      const referendum = await Referendum.findByPostIdAndChain(testPostId, testChain, testDaoId);
      expect(referendum!.internal_status).toBe(InternalStatus.VotedAye);
    });

    it('should get ready to vote referendums for specific DAO', async () => {
      // Create another referendum in ReadyToVote status
      const readyRefId = await Referendum.create({
        post_id: testPostId + 1,
        chain: testChain,
        dao_id: testDaoId,
        title: 'Ready Referendum',
        description: 'Testing ready to vote',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: TimelineStatus.Deciding,
        internal_status: InternalStatus.ReadyToVote,
        link: `https://polkadot.polkassembly.io/referenda/${testPostId + 1}`,
        voting_start_date: new Date().toISOString(),
        voting_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      // Create voting decision with suggested vote
      await VotingDecision.upsert(readyRefId, testDaoId, {
        suggested_vote: SuggestedVote.Nay
      });

      // Get ready to vote referendums
      const readyRefs = await Referendum.getReadyToVote(testDaoId);
      
      expect(Array.isArray(readyRefs)).toBe(true);
      expect(readyRefs.length).toBeGreaterThan(0);
      
      // Find our referendum
      const ourRef = readyRefs.find(r => r.id === readyRefId);
      expect(ourRef).toBeDefined();
      expect(ourRef!.dao_id).toBe(testDaoId);
      expect(ourRef!.suggested_vote).toBe(SuggestedVote.Nay);
      expect(ourRef!.internal_status).toBe(InternalStatus.ReadyToVote);

      // Cleanup
      await db.run('DELETE FROM voting_decisions WHERE referendum_id = ?', [readyRefId]);
      await db.run('DELETE FROM referendums WHERE id = ?', [readyRefId]);
    });
  });

  describe('Multi-DAO Isolation', () => {
    let dao2Id: number;
    let dao2RefId: number;

    beforeAll(async () => {
      // Create second DAO
      dao2Id = await DAO.create({
        name: 'Second Test DAO ' + Date.now(),
        description: 'Second DAO for isolation testing',
        polkadot_multisig: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
        proposer_mnemonic: 'test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2'
      });

      // Create referendum for second DAO with different post_id
      // Note: In production with multi-DAO, the schema would allow same post_id/chain for different DAOs
      // but the test database still has the legacy unique constraint
      const dao2PostId = testPostId + 50;
      dao2RefId = await Referendum.create({
        post_id: dao2PostId,
        chain: testChain,
        dao_id: dao2Id,
        title: 'DAO 2 Referendum',
        description: 'Different post_id for different DAO',
        requested_amount_usd: 25000,
        origin: Origin.Root,
        referendum_timeline: TimelineStatus.Deciding,
        internal_status: InternalStatus.NotStarted,
        link: `https://polkadot.polkassembly.io/referenda/${dao2PostId}`,
        voting_start_date: new Date().toISOString(),
        voting_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });
    });

    afterAll(async () => {
      try {
        if (dao2RefId) {
          await db.run('DELETE FROM voting_decisions WHERE referendum_id = ?', [dao2RefId]);
          await db.run('DELETE FROM referendums WHERE id = ?', [dao2RefId]);
        }
        if (dao2Id) {
          await db.run('DELETE FROM daos WHERE id = ?', [dao2Id]);
        }
      } catch (error) {
        console.log('DAO 2 cleanup warning:', error);
      }
    });

    it('should keep referendums separate by DAO', async () => {
      // Both DAOs should have different referendums
      const dao1Ref = await Referendum.findByPostIdAndChain(testPostId, testChain, testDaoId);
      const dao2Ref = await Referendum.findByPostIdAndChain(testPostId + 50, testChain, dao2Id);

      expect(dao1Ref).not.toBeNull();
      expect(dao2Ref).not.toBeNull();
      expect(dao1Ref!.id).not.toBe(dao2Ref!.id);
      expect(dao1Ref!.dao_id).toBe(testDaoId);
      expect(dao2Ref!.dao_id).toBe(dao2Id);
    });

    it('should keep voting decisions separate by DAO', async () => {
      // Add voting decision for DAO 2
      await VotingDecision.upsert(dao2RefId, dao2Id, {
        suggested_vote: SuggestedVote.Nay
      });

      // Get decisions for each DAO
      const dao1Decision = await VotingDecision.getByReferendumId(testReferendumId, testDaoId);
      const dao2Decision = await VotingDecision.getByReferendumId(dao2RefId, dao2Id);

      expect(dao1Decision!.suggested_vote).toBe(SuggestedVote.Aye);
      expect(dao2Decision!.suggested_vote).toBe(SuggestedVote.Nay);
      expect(dao1Decision!.dao_id).toBe(testDaoId);
      expect(dao2Decision!.dao_id).toBe(dao2Id);
    });

    it('should filter getAll by daoId correctly', async () => {
      const dao1Refs = await Referendum.getAll(testDaoId);
      const dao2Refs = await Referendum.getAll(dao2Id);

      // All refs for DAO 1 should have dao_id = testDaoId
      dao1Refs.forEach(ref => {
        expect(ref.dao_id).toBe(testDaoId);
      });

      // All refs for DAO 2 should have dao_id = dao2Id
      dao2Refs.forEach(ref => {
        expect(ref.dao_id).toBe(dao2Id);
      });

      // IDs should not overlap
      const dao1Ids = new Set(dao1Refs.map(r => r.id));
      const dao2Ids = new Set(dao2Refs.map(r => r.id));
      dao2Ids.forEach(id => {
        expect(dao1Ids.has(id)).toBe(false);
      });
    });
  });

  describe('Backward Compatibility - Status Transitions', () => {
    it('should handle complete status transition workflow', async () => {
      // Create new referendum for status testing
      const statusTestId = await Referendum.create({
        post_id: testPostId + 100,
        chain: testChain,
        dao_id: testDaoId,
        title: 'Status Transition Test',
        description: 'Testing status transitions',
        requested_amount_usd: 15000,
        origin: Origin.Root,
        referendum_timeline: TimelineStatus.Deciding,
        internal_status: InternalStatus.NotStarted,
        link: `https://polkadot.polkassembly.io/referenda/${testPostId + 100}`,
        voting_start_date: new Date().toISOString(),
        voting_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      // Status progression: NotStarted -> Considering -> ReadyToVote -> VotedAye
      
      // Step 1: NotStarted -> Considering
      await Referendum.update(testPostId + 100, testChain, testDaoId, {
        internal_status: InternalStatus.Considering
      });
      let ref = await Referendum.findByPostIdAndChain(testPostId + 100, testChain, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.Considering);

      // Step 2: Considering -> ReadyToVote (by suggesting vote)
      await VotingDecision.upsert(statusTestId, testDaoId, {
        suggested_vote: SuggestedVote.Aye
      });
      await Referendum.update(testPostId + 100, testChain, testDaoId, {
        internal_status: InternalStatus.ReadyToVote
      });
      ref = await Referendum.findByPostIdAndChain(testPostId + 100, testChain, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.ReadyToVote);

      // Step 3: ReadyToVote -> VotedAye (by finalizing and executing)
      await VotingDecision.upsert(statusTestId, testDaoId, {
        final_vote: SuggestedVote.Aye,
        vote_executed: true,
        vote_executed_date: new Date().toISOString()
      });
      await Referendum.updateVotingStatus(testPostId + 100, testChain, testDaoId, InternalStatus.VotedAye);
      ref = await Referendum.findByPostIdAndChain(testPostId + 100, testChain, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.VotedAye);

      // Cleanup
      await db.run('DELETE FROM voting_decisions WHERE referendum_id = ?', [statusTestId]);
      await db.run('DELETE FROM referendums WHERE id = ?', [statusTestId]);
    });

    it('should handle different vote outcomes correctly', async () => {
      // Test Nay vote
      const nayTestId = await Referendum.create({
        post_id: testPostId + 101,
        chain: testChain,
        dao_id: testDaoId,
        title: 'Nay Vote Test',
        description: 'Testing Nay vote',
        requested_amount_usd: 5000,
        origin: Origin.Root,
        referendum_timeline: TimelineStatus.Deciding,
        internal_status: InternalStatus.NotStarted,
        link: `https://polkadot.polkassembly.io/referenda/${testPostId + 101}`,
        voting_start_date: new Date().toISOString(),
        voting_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      await VotingDecision.upsert(nayTestId, testDaoId, {
        suggested_vote: SuggestedVote.Nay,
        final_vote: SuggestedVote.Nay,
        vote_executed: true,
        vote_executed_date: new Date().toISOString()
      });
      await Referendum.updateVotingStatus(testPostId + 101, testChain, testDaoId, InternalStatus.VotedNay);

      const ref = await Referendum.findByPostIdAndChain(testPostId + 101, testChain, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.VotedNay);

      // Cleanup
      await db.run('DELETE FROM voting_decisions WHERE referendum_id = ?', [nayTestId]);
      await db.run('DELETE FROM referendums WHERE id = ?', [nayTestId]);
    });
  });
});

