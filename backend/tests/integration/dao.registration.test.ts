import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { db } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { multisigService } from '../../src/services/multisig';
import { Chain } from '../../src/types/properties';
import daoRouter from '../../src/routes/dao';

// Mock auth middleware for testing
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Test User' };
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
    req.user = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Test User' };
    next();
  }
}));

// Mock the multisig service
jest.mock('../../src/services/multisig');

// Mock signature verification
jest.mock('@polkadot/util-crypto', () => ({
  ...jest.requireActual('@polkadot/util-crypto'),
  signatureVerify: jest.fn(),
  mnemonicGenerate: jest.fn(() => 'test test test test test test test test test test test test test test test test test test test test test test test test')
}));

describe('DAO Registration Integration Tests', () => {
  let app: Express;
  let mockToken: string;

  beforeAll(async () => {
    // Create Express app with DAO routes
    app = express();
    app.use(bodyParser.json());
    app.use('/api/dao', daoRouter);
    
    // Create a mock JWT token
    mockToken = 'Bearer test-token';
  });

  beforeEach(async () => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    const { signatureVerify } = require('@polkadot/util-crypto');
    signatureVerify.mockReturnValue({ isValid: true });
  });

  afterAll(async () => {
    // Cleanup test database
    await db.run('DELETE FROM daos WHERE name LIKE ?', ['Test DAO%']);
  });

  describe('POST /api/dao/register', () => {
    const validRegistrationData = {
      name: 'Test DAO ' + Date.now(),
      description: 'A test DAO for integration testing',
      polkadotMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      kusamaMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      signature: '0x1234567890abcdef',
      message: 'I want to register Test DAO and confirm I am a member of the multisig'
    };

    it('should register a DAO successfully with valid data', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('DAO registered successfully');
      expect(response.body.dao).toHaveProperty('id');
      expect(response.body.dao).toHaveProperty('name');
      expect(response.body.dao.chains).toEqual(expect.arrayContaining([Chain.Polkadot, Chain.Kusama]));
      expect(response.body.dao.status).toBe('active');

      // Cleanup
      if (response.body.dao.id) {
        await db.run('DELETE FROM daos WHERE id = ?', [response.body.dao.id]);
      }
    });

    it('should reject registration without DAO name', async () => {
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({ ...validRegistrationData, name: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('DAO name is required');
    });

    it('should reject registration without multisig addresses', async () => {
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({
          ...validRegistrationData,
          polkadotMultisig: null,
          kusamaMultisig: null
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('At least one multisig address (Polkadot or Kusama) is required');
    });

    it('should reject registration without wallet address', async () => {
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({ ...validRegistrationData, walletAddress: null })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Wallet address is required');
    });

    it('should reject registration without signature', async () => {
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({ ...validRegistrationData, signature: null })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Signature is required for verification');
    });

    it('should reject registration with invalid signature', async () => {
      const { signatureVerify } = require('@polkadot/util-crypto');
      signatureVerify.mockReturnValue({ isValid: false });

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid signature');
    });

    it('should reject registration if message does not include DAO name', async () => {
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({
          ...validRegistrationData,
          message: 'I want to register a DAO'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Message must include the DAO name');
    });

    it('should reject registration if DAO name already exists', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);

      // First registration
      const firstResponse = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(201);

      // Second registration with same name
      const secondResponse = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(409);

      expect(secondResponse.body.success).toBe(false);
      expect(secondResponse.body.error).toContain('DAO with this name already exists');

      // Cleanup
      if (firstResponse.body.dao.id) {
        await db.run('DELETE FROM daos WHERE id = ?', [firstResponse.body.dao.id]);
      }
    });

    it('should reject registration if multisig not found on-chain', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue(null as any);

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain(expect.stringContaining('not found on-chain'));
    });

    it('should reject registration if wallet is not a member of multisig', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(validRegistrationData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain(expect.stringContaining('not a member'));
    });

    it('should allow registration with only Polkadot multisig', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);

      const dataWithoutKusama = {
        ...validRegistrationData,
        kusamaMultisig: null
      };

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(dataWithoutKusama)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.dao.chains).toEqual([Chain.Polkadot]);

      // Cleanup
      if (response.body.dao.id) {
        await db.run('DELETE FROM daos WHERE id = ?', [response.body.dao.id]);
      }
    });

    it('should allow registration with only Kusama multisig', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Kusama'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);

      const dataWithoutPolkadot = {
        ...validRegistrationData,
        polkadotMultisig: null
      };

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(dataWithoutPolkadot)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.dao.chains).toEqual([Chain.Kusama]);

      // Cleanup
      if (response.body.dao.id) {
        await db.run('DELETE FROM daos WHERE id = ?', [response.body.dao.id]);
      }
    });

    it('should reject DAO name longer than 100 characters', async () => {
      const longName = 'A'.repeat(101);
      
      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({ ...validRegistrationData, name: longName })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('DAO name must be less than 100 characters');
    });

    it('should trim whitespace from DAO name and description', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getMultisigInfo.mockResolvedValue({
        members: [{
          wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          team_member_name: 'Test User',
          network: 'Polkadot'
        }],
        threshold: 2
      });
      mockMultisigService.isTeamMember.mockResolvedValue(true);

      const dataWithWhitespace = {
        ...validRegistrationData,
        name: '  ' + validRegistrationData.name + '  ',
        description: '  Test description  '
      };

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(dataWithWhitespace)
        .expect(201);

      expect(response.body.dao.name).toBe(validRegistrationData.name);

      // Cleanup
      if (response.body.dao.id) {
        await db.run('DELETE FROM daos WHERE id = ?', [response.body.dao.id]);
      }
    });
  });

  describe('GET /api/dao/:daoId', () => {
    let testDaoId: number;

    beforeEach(async () => {
      // Setup mocks
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
      const registrationData = {
        name: 'Test DAO GET ' + Date.now(),
        description: 'A test DAO for GET endpoint testing',
        polkadotMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        kusamaMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        signature: '0x1234567890abcdef',
        message: 'I want to register Test DAO GET and confirm I am a member of the multisig'
      };

      const response = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send(registrationData);

      testDaoId = response.body.dao.id;
    });

    afterEach(async () => {
      if (testDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [testDaoId]);
      }
    });

    it('should return complete DAO info with all fields and proper data types', async () => {
      const response = await request(app)
        .get(`/api/dao/${testDaoId}`)
        .set('Authorization', mockToken)
        .expect(200);

      const { dao } = response.body;
      
      // Basic fields
      expect(response.body.success).toBe(true);
      expect(dao.id).toBe(testDaoId);
      expect(dao).toHaveProperty('name');
      expect(dao).toHaveProperty('description');
      expect(dao.status).toBe('active');
      expect(dao).toHaveProperty('created_at');
      expect(dao).toHaveProperty('updated_at');
      
      // Chains and multisig addresses (public data)
      expect(dao.chains).toEqual(expect.arrayContaining([Chain.Polkadot, Chain.Kusama]));
      expect(dao.multisig_addresses.polkadot).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      expect(dao.multisig_addresses.kusama).toBe('15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5');
      
      // Member counts
      expect(dao.member_counts.polkadot).toBe(2);
      expect(dao.member_counts.kusama).toBe(2);
      
      // Stats
      expect(typeof dao.stats.total_referendums).toBe('number');
      expect(typeof dao.stats.active_referendums).toBe('number');
      expect(typeof dao.stats.voted_referendums).toBe('number');
      expect(typeof dao.stats.ready_to_vote).toBe('number');
      
      // Sensitive fields should not be exposed
      expect(dao).not.toHaveProperty('polkadot_multisig_encrypted');
      expect(dao).not.toHaveProperty('kusama_multisig_encrypted');
      expect(dao).not.toHaveProperty('proposer_mnemonic_encrypted');
      expect(dao).not.toHaveProperty('proposer_mnemonic');
    });

    it('should require authentication and handle errors correctly', async () => {
      // No auth token
      await request(app).get(`/api/dao/${testDaoId}`).expect(401);
      
      // Non-existent DAO
      const notFoundResponse = await request(app)
        .get('/api/dao/999999')
        .set('Authorization', mockToken)
        .expect(404);
      expect(notFoundResponse.body.error).toBe('DAO not found');
      
      // Invalid DAO IDs
      const invalidResponse = await request(app)
        .get('/api/dao/invalid')
        .set('Authorization', mockToken)
        .expect(400);
      expect(invalidResponse.body.error).toBe('Invalid DAO ID');
      
      const negativeResponse = await request(app)
        .get('/api/dao/-1')
        .set('Authorization', mockToken)
        .expect(400);
      expect(negativeResponse.body.error).toBe('Invalid DAO ID');
    });

    it('should handle single-chain DAOs correctly', async () => {
      const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
      mockMultisigService.getCachedTeamMembers.mockResolvedValue([{
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Alice',
        network: 'Polkadot'
      }]);

      // Polkadot only
      const polkadotOnlyResponse = await request(app)
        .post('/api/dao/register')
        .set('Authorization', mockToken)
        .send({
          name: 'Polkadot DAO ' + Date.now(),
          polkadotMultisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
          kusamaMultisig: null,
          walletAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          signature: '0x1234567890abcdef',
          message: 'I want to register Polkadot DAO and confirm I am a member of the multisig'
        });

      const polkadotDaoId = polkadotOnlyResponse.body.dao.id;
      const polkadotDao = await request(app)
        .get(`/api/dao/${polkadotDaoId}`)
        .set('Authorization', mockToken)
        .expect(200);

      expect(polkadotDao.body.dao.chains).toEqual([Chain.Polkadot]);
      expect(polkadotDao.body.dao.multisig_addresses.polkadot).toBeTruthy();
      expect(polkadotDao.body.dao.multisig_addresses.kusama).toBeNull();
      expect(polkadotDao.body.dao.member_counts.polkadot).toBe(1);
      expect(polkadotDao.body.dao.member_counts.kusama).toBe(0);

      await db.run('DELETE FROM daos WHERE id = ?', [polkadotDaoId]);
    });
  });
});

