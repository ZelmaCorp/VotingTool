import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { db } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { DaoService } from '../../src/services/daoService';
import { multisigService } from '../../src/services/multisig';
import { Chain } from '../../src/types/properties';
import daoRouter from '../../src/routes/dao';

// Mock auth middleware for testing
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    // Check if Authorization header exists
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' };
    next();
  },
  addDaoContext: (req: any, res: any, next: any) => {
    req.daoId = 1;
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

describe('DAO Full Flow Integration Test', () => {
  let app: Express;
  let mockToken: string;
  let createdDaoId: number | null = null;

  beforeAll(async () => {
    // Set encryption key for testing
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // Initialize database for testing
    await db.initialize();
    
    // Check if daos table exists, if not create it
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='daos'", []);
    if (tables.length === 0) {
      // Create daos table
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
      
      // Add dao_id to referendums if not exists
      try {
        await db.run('ALTER TABLE referendums ADD COLUMN dao_id INTEGER NOT NULL DEFAULT 1 REFERENCES daos(id)', []);
      } catch (e: any) {
        if (!e.message?.includes('duplicate column')) console.log('Column dao_id already exists or error:', e.message?.substring(0, 50));
      }
    }
    
    // Create Express app with DAO routes
    app = express();
    app.use(bodyParser.json());
    app.use('/api/dao', daoRouter);
    
    mockToken = 'Bearer test-token';
  });

  afterAll(async () => {
    // Cleanup: Remove any test DAOs created
    try {
      if (createdDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [createdDaoId]);
      }
      await db.run('DELETE FROM daos WHERE name LIKE ?', ['Full Flow Test DAO%']);
      await db.run('DELETE FROM daos WHERE name LIKE ?', ['Multi DAO Test%']);
    } catch (error) {
      console.log('Cleanup warning:', error);
    }
  });

  describe('Complete DAO Registration and Fetch Flow', () => {
    it('should register a DAO and then fetch it with complete information', async () => {
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

      // Step 1: Register a DAO
      const daoName = 'Full Flow Test DAO ' + Date.now();
      const registrationData = {
        name: daoName,
        description: 'Testing the complete DAO flow',
        polkadotMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        kusamaMultisig: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F',
        walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        signature: '0x1234567890abcdef',
        message: `I want to register ${daoName} and confirm I am a member of the multisig`
      };

      const registerResponse = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(registrationData)
        .expect(201);

      // Verify registration response
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.dao).toBeDefined();
      expect(registerResponse.body.dao.id).toBeDefined();
      expect(registerResponse.body.dao.name).toBe(daoName);
      expect(registerResponse.body.dao.status).toBe('active');
      expect(registerResponse.body.dao.chains).toEqual(expect.arrayContaining([Chain.Polkadot, Chain.Kusama]));

      createdDaoId = registerResponse.body.dao.id;
      expect(createdDaoId).toBeDefined();
      expect(typeof createdDaoId).toBe('number');

      // Step 2: Verify DAO exists in database
      const daoFromDb = await DAO.getById(createdDaoId!);
      expect(daoFromDb).not.toBeNull();
      expect(daoFromDb!.name).toBe(daoName);
      expect(daoFromDb!.status).toBe('active');
      expect(daoFromDb!.polkadot_multisig_encrypted).toBeTruthy();
      expect(daoFromDb!.kusama_multisig_encrypted).toBeTruthy();

      // Step 3: Verify encrypted fields are actually encrypted
      expect(daoFromDb!.polkadot_multisig_encrypted).not.toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      expect(daoFromDb!.kusama_multisig_encrypted).not.toBe('HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F');

      // Step 4: Verify decryption works
      const polkadotMultisig = await DAO.getDecryptedMultisig(createdDaoId!, Chain.Polkadot);
      const kusamaMultisig = await DAO.getDecryptedMultisig(createdDaoId!, Chain.Kusama);
      expect(polkadotMultisig).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      expect(kusamaMultisig).toBe('HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F');

      // Step 5: Fetch DAO via API using new GET endpoint
      const fetchResponse = await request(app)
        .get(`/api/dao/${createdDaoId}`)
        .set('Authorization', mockToken)
        .expect(200);

      // Step 6: Verify fetched DAO has complete information
      const fetchedDao = fetchResponse.body.dao;
      expect(fetchResponse.body.success).toBe(true);
      
      // Basic fields
      expect(fetchedDao.id).toBe(createdDaoId);
      expect(fetchedDao.name).toBe(daoName);
      expect(fetchedDao.description).toBe('Testing the complete DAO flow');
      expect(fetchedDao.status).toBe('active');
      expect(fetchedDao.created_at).toBeDefined();
      expect(fetchedDao.updated_at).toBeDefined();

      // Chains configuration
      expect(fetchedDao.chains).toEqual(expect.arrayContaining([Chain.Polkadot, Chain.Kusama]));
      expect(fetchedDao.chains).toHaveLength(2);

      // Multisig addresses (public data)
      expect(fetchedDao.multisig_addresses).toBeDefined();
      expect(fetchedDao.multisig_addresses.polkadot).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      expect(fetchedDao.multisig_addresses.kusama).toBe('HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F');

      // Member counts
      expect(fetchedDao.member_counts).toBeDefined();
      expect(fetchedDao.member_counts.polkadot).toBe(2);
      expect(fetchedDao.member_counts.kusama).toBe(2);

      // Stats
      expect(fetchedDao.stats).toBeDefined();
      expect(fetchedDao.stats.total_referendums).toBe(0); // New DAO, no referendums
      expect(fetchedDao.stats.active_referendums).toBe(0);
      expect(fetchedDao.stats.voted_referendums).toBe(0);
      expect(fetchedDao.stats.ready_to_vote).toBe(0);

      // Sensitive fields should NOT be exposed
      expect(fetchedDao).not.toHaveProperty('polkadot_multisig_encrypted');
      expect(fetchedDao).not.toHaveProperty('kusama_multisig_encrypted');
      expect(fetchedDao).not.toHaveProperty('proposer_mnemonic_encrypted');
      expect(fetchedDao).not.toHaveProperty('proposer_mnemonic');

      // Step 7: Test DaoService directly
      const daoFromService = await DaoService.getSafeInfo(createdDaoId!);
      expect(daoFromService).not.toBeNull();
      expect(daoFromService!.id).toBe(createdDaoId);
      expect(daoFromService!.name).toBe(daoName);
      expect(daoFromService!.chains).toHaveLength(2);
      expect(daoFromService!.member_counts.polkadot).toBe(2);
      expect(daoFromService!.member_counts.kusama).toBe(2);

      // Step 8: Test member retrieval through service
      const polkadotMembers = await DaoService.getMembers(createdDaoId!, Chain.Polkadot);
      expect(polkadotMembers).toHaveLength(2);
      expect(polkadotMembers[0].wallet_address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
      expect(polkadotMembers[1].wallet_address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');

      // Step 9: Test membership validation
      const isAliceMember = await DaoService.isValidMember(
        createdDaoId!,
        '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        Chain.Polkadot
      );
      expect(isAliceMember).toBe(true);

      // Step 10: Test finding DAO by multisig
      const foundDao = await DaoService.findByMultisig(
        '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        Chain.Polkadot
      );
      expect(foundDao).not.toBeNull();
      expect(foundDao!.id).toBe(createdDaoId);
      expect(foundDao!.name).toBe(daoName);
    });

    it('should handle DAO not found gracefully', async () => {
      const response = await request(app)
        .get('/api/dao/999999')
        .set('Authorization', mockToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('DAO not found');
    });

    it('should require authentication for fetching DAO info', async () => {
      const response = await request(app)
        .get('/api/dao/1')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate DAO ID format', async () => {
      const response = await request(app)
        .get('/api/dao/not-a-number')
        .set('Authorization', mockToken)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid DAO ID');
    });
  });

  describe('Multi-DAO Support Verification', () => {
    it('should properly separate data for different DAOs', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Alice',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);
      mockMultisigService.getCachedTeamMembers.mockResolvedValue([{
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Alice',
        network: 'Polkadot'
      }]);

      // Create two separate DAOs
      const dao1Name = 'Multi DAO Test 1 ' + Date.now();
      const dao2Name = 'Multi DAO Test 2 ' + (Date.now() + 1);

      const dao1Response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({
          name: dao1Name,
          description: 'First DAO',
          polkadotMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
          walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          signature: '0x1234567890abcdef',
          message: `I want to register ${dao1Name} and confirm I am a member of the multisig`
        });

      const dao2Response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({
          name: dao2Name,
          description: 'Second DAO',
          polkadotMultisig: '14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3',
          walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          signature: '0x1234567890abcdef',
          message: `I want to register ${dao2Name} and confirm I am a member of the multisig`
        });

      const dao1Id = dao1Response.body.dao.id;
      const dao2Id = dao2Response.body.dao.id;

      // Fetch both DAOs
      const fetch1 = await request(app)
        .get(`/api/dao/${dao1Id}`)
        .set('Authorization', mockToken)
        .expect(200);

      const fetch2 = await request(app)
        .get(`/api/dao/${dao2Id}`)
        .set('Authorization', mockToken)
        .expect(200);

      // Verify they have different data
      expect(fetch1.body.dao.id).not.toBe(fetch2.body.dao.id);
      expect(fetch1.body.dao.name).toBe(dao1Name);
      expect(fetch2.body.dao.name).toBe(dao2Name);
      expect(fetch1.body.dao.description).toBe('First DAO');
      expect(fetch2.body.dao.description).toBe('Second DAO');
      expect(fetch1.body.dao.multisig_addresses.polkadot).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      expect(fetch2.body.dao.multisig_addresses.polkadot).toBe('14E5nqKAp3oAJcmzgZhUD2RcptBeUBScxKHgJKU4HPNcKVf3');

      // Cleanup
      await db.run('DELETE FROM daos WHERE id IN (?, ?)', [dao1Id, dao2Id]);
    });
  });
});

