import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { signatureVerify, cryptoWaitReady } from '@polkadot/util-crypto';
import authRouter from '../../src/routes/auth';
import { multisigService } from '../../src/services/multisig';
import { DatabaseConnection } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { DaoService } from '../../src/services/daoService';

const db = DatabaseConnection.getInstance();

describe('Web3 Authentication Integration', () => {
  let app: Express;
  let keyring: Keyring;
  let testAccount: any;
  let testDaoId: number;
  const testAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Test address

  beforeAll(async () => {
    // Set encryption key for testing
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    // Initialize database
    await db.initialize();
    
    // Initialize WASM crypto first
    await cryptoWaitReady();
    
    // Create Express app with auth routes
    app = express();
    app.use(bodyParser.json());
    app.use('/auth', authRouter);
    
    // Initialize keyring for signature testing
    keyring = new Keyring({ type: 'sr25519' });
    testAccount = keyring.addFromUri('//Alice'); // Test account
    
    // Create a test DAO
    testDaoId = await DAO.create({
      name: 'Web3 Auth Test DAO ' + Date.now(),
      description: 'Test DAO for Web3 authentication',
      polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      proposer_mnemonic: 'test test test test test test test test test test test test'
    });
    
    // Mock multisig service methods to return test team member
    jest.spyOn(multisigService, 'getCachedTeamMembers').mockResolvedValue([
      {
        wallet_address: testAccount.address,
        team_member_name: 'Test Team Member',
        network: 'Polkadot'
      }
    ]);
    
    jest.spyOn(multisigService, 'getTeamMemberByAddress').mockResolvedValue({
      wallet_address: testAccount.address,
      team_member_name: 'Test Team Member',
      network: 'Polkadot'
    });
    
    jest.spyOn(multisigService, 'findMemberByAddress').mockImplementation((members, address) => {
      return members.find(m => m.wallet_address === address || m.wallet_address === testAccount.address) || null;
    });
    
    jest.spyOn(multisigService, 'isTeamMember').mockResolvedValue(true);
    
    // Mock DaoService to return our test DAO for the test wallet address
    jest.spyOn(DaoService, 'findDaosForWallet').mockImplementation(async (walletAddress: string) => {
      if (walletAddress === testAccount.address) {
        const dao = await DAO.getById(testDaoId);
        return dao ? [dao] : [];
      }
      return [];
    });
  });

  afterAll(async () => {
    // Cleanup test DAO
    try {
      if (testDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [testDaoId]);
      }
      await db.run('DELETE FROM daos WHERE name LIKE ?', ['Web3 Auth Test DAO%']);
    } catch (error) {
      console.log('Cleanup warning:', error);
    }
    
    jest.restoreAllMocks();
  });

  it('should authenticate team members with real Web3 signatures', async () => {
    // Step 1: Create a message to sign (similar to what frontend would do)
    const timestamp = Date.now();
    const message = `Authenticate with OpenGov Voting Tool\n\nAddress: ${testAccount.address}\nTimestamp: ${timestamp}\n\nClick "Sign Message" to continue.`;
    
    // Step 2: Sign the message with the test account
    const signature = testAccount.sign(message);
    const signatureHex = u8aToHex(signature);
    
    // Step 3: Verify signature works (sanity check)
    const verification = signatureVerify(message, signatureHex, testAccount.address);
    expect(verification.isValid).toBe(true);
    
    // Step 4: Test the authentication endpoint
    const authResponse = await request(app)
      .post('/auth/web3-login')
      .send({
        address: testAccount.address,
        signature: signatureHex,
        message: message,
        timestamp: timestamp
      });

    expect(authResponse.status).toBe(200);
    expect(authResponse.body.success).toBe(true);
    expect(authResponse.body.token).toBeDefined();
    expect(authResponse.body.user).toEqual({
      address: testAccount.address,
      name: 'Test Team Member',
      network: 'Polkadot'
    });
  });

  it('should enforce team member authorization across protected endpoints', async () => {
    // Step 1: Create valid signature for authentication
    const timestamp = Date.now();
    const message = `Authenticate with OpenGov Voting Tool\n\nAddress: ${testAccount.address}\nTimestamp: ${timestamp}\n\nClick "Sign Message" to continue.`;
    const signature = testAccount.sign(message);
    const signatureHex = u8aToHex(signature);
    
    // Step 2: Authenticate and get token
    const authResponse = await request(app)
      .post('/auth/web3-login')
      .send({
        address: testAccount.address,
        signature: signatureHex,
        message: message,
        timestamp: timestamp
      });

    expect(authResponse.status).toBe(200);
    const authToken = authResponse.body.token;
    
    // Step 3: Verify the token is properly formatted JWT
    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe('string');
    expect(authToken.split('.').length).toBe(3); // JWT has 3 parts
    
    // Step 4: Test token contains expected user data
    // Decode the JWT payload (middle part) to verify user info
    const tokenParts = authToken.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    expect(payload.address).toBe(testAccount.address);
    expect(payload.name).toBe('Test Team Member');
    
    // Step 5: Test with invalid signature
    const invalidAuthResponse = await request(app)
      .post('/auth/web3-login')
      .send({
        address: testAccount.address,
        signature: '0xinvalidsignature',
        message: message,
        timestamp: timestamp
      });

    expect(invalidAuthResponse.status).toBe(401);
    expect(invalidAuthResponse.body.success).toBe(false);
    expect(invalidAuthResponse.body.error).toBe('Invalid signature');
    
    // Step 6: Test with non-team member address
    const nonMemberAccount = keyring.addFromUri('//Bob');
    const nonMemberMessage = `Authenticate with OpenGov Voting Tool\n\nAddress: ${nonMemberAccount.address}\nTimestamp: ${timestamp}\n\nClick "Sign Message" to continue.`;
    const nonMemberSignature = nonMemberAccount.sign(nonMemberMessage);
    const nonMemberSignatureHex = u8aToHex(nonMemberSignature);
    
    const nonMemberResponse = await request(app)
      .post('/auth/web3-login')
      .send({
        address: nonMemberAccount.address,
        signature: nonMemberSignatureHex,
        message: nonMemberMessage,
        timestamp: timestamp
      });

    expect(nonMemberResponse.status).toBe(403);
    expect(nonMemberResponse.body.success).toBe(false);
    expect(nonMemberResponse.body.error).toBe('Access denied: Wallet address not registered as multisig member');
  });
}); 