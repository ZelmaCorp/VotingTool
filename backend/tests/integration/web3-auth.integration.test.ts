import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { signatureVerify, cryptoWaitReady } from '@polkadot/util-crypto';
import authRouter from '../../src/routes/auth';
import { multisigService } from '../../src/services/multisig';

describe('Web3 Authentication Integration', () => {
  let app: Express;
  let keyring: Keyring;
  let testAccount: any;
  const testAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Test address

  beforeAll(async () => {
    // Initialize WASM crypto first
    await cryptoWaitReady();
    
    // Create Express app with auth routes
    app = express();
    app.use(bodyParser.json());
    app.use('/auth', authRouter);
    
    // Initialize keyring for signature testing
    keyring = new Keyring({ type: 'sr25519' });
    testAccount = keyring.addFromUri('//Alice'); // Test account
    
    // Mock multisig service to return test team member
    jest.spyOn(multisigService, 'getCachedTeamMembers').mockResolvedValue([
      {
        wallet_address: testAccount.address,
        team_member_name: 'Test Team Member',
        network: 'Polkadot'
      }
    ]);
    
    // Mock the flexible address matching
    jest.spyOn(multisigService, 'findMemberByAddress').mockImplementation((members, address) => {
      return members.find(m => m.wallet_address === address || m.wallet_address === testAccount.address) || null;
    });
  });

  afterAll(async () => {
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