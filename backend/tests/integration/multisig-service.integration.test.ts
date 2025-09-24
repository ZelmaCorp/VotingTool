import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { multisigService } from '../../src/services/multisig';
import daoRouter from '../../src/routes/dao';

// Mock auth middleware for testing
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { address: '1TestUserAddress', name: 'Test User' };
    next();
  },
  requireTeamMember: (req: any, res: any, next: any) => {
    req.user = { address: '1TestUserAddress', name: 'Test User' };
    next();
  }
}));

describe('Multisig Service Integration', () => {
  let app: Express;

  beforeAll(async () => {
    // Create Express app with DAO routes
    app = express();
    app.use(bodyParser.json());
    app.use('/dao', daoRouter);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should fetch and cache real multisig members from blockchain', async () => {
    // Test the /dao/members endpoint which uses multisig service
    const membersResponse = await request(app)
      .get('/dao/members')
      .set('Authorization', 'Bearer test-token');

    expect(membersResponse.status).toBe(200);
    expect(membersResponse.body.success).toBe(true);
    expect(membersResponse.body.members).toBeInstanceOf(Array);
    
    // Verify the structure of returned members
    if (membersResponse.body.members.length > 0) {
      const member = membersResponse.body.members[0];
      expect(member).toHaveProperty('address');
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('network');
      expect(typeof member.address).toBe('string');
      expect(typeof member.name).toBe('string');
      expect(['Polkadot', 'Kusama']).toContain(member.network);
    }

    // Test caching - second call should be faster (from cache)
    const startTime = Date.now();
    const cachedResponse = await request(app)
      .get('/dao/members')
      .set('Authorization', 'Bearer test-token');
    const endTime = Date.now();

    expect(cachedResponse.status).toBe(200);
    expect(cachedResponse.body.members).toEqual(membersResponse.body.members);
    
    // Cached response should be very fast (under 100ms)
    expect(endTime - startTime).toBeLessThan(100);
  });

  it('should detect proxy relationships and parent addresses', async () => {
    // Test the /dao/parent endpoint which checks for proxy relationships
    const parentResponse = await request(app)
      .get('/dao/parent')
      .set('Authorization', 'Bearer test-token');

    expect(parentResponse.status).toBe(200);
    expect(parentResponse.body.success).toBe(true);
    expect(parentResponse.body.parent).toHaveProperty('isProxy');
    expect(parentResponse.body.parent).toHaveProperty('currentAddress');
    expect(parentResponse.body.parent).toHaveProperty('network');
    
    // Verify the response structure
    const parentInfo = parentResponse.body.parent;
    expect(typeof parentInfo.isProxy).toBe('boolean');
    expect(typeof parentInfo.currentAddress).toBe('string');
    expect(['Polkadot', 'Kusama']).toContain(parentInfo.network);
    
    if (parentInfo.isProxy) {
      expect(parentInfo).toHaveProperty('parentAddress');
      expect(typeof parentInfo.parentAddress).toBe('string');
    }

    // Test address normalization by calling the service directly
    const members = await multisigService.getCachedTeamMembers();
    expect(members).toBeInstanceOf(Array);
    
    if (members.length > 0) {
      // Test flexible address matching
      const testAddress = members[0].wallet_address;
      const foundMember = multisigService.findMemberByAddress(members, testAddress);
      expect(foundMember).toBeTruthy();
      expect(foundMember?.wallet_address).toBe(testAddress);
      
      // Test case-insensitive matching
      const lowerCaseAddress = testAddress.toLowerCase();
      const foundMemberCaseInsensitive = multisigService.findMemberByAddress(members, lowerCaseAddress);
      // Should find member even with different case (depending on implementation)
      expect(foundMemberCaseInsensitive).toBeTruthy();
    }
  });
}); 