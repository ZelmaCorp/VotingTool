// Mock dependencies FIRST to avoid sqlite3 import issues
jest.mock('../../src/database/connection', () => ({
  db: {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    transaction: jest.fn()
  }
}));
jest.mock('../../src/services/multisig');
jest.mock('../../src/database/models/referendum');

import request from 'supertest';
import express from 'express';
import { db } from '../../src/database/connection';
import { multisigService } from '../../src/services/multisig';
import { Referendum } from '../../src/database/models/referendum';
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

// Import the router after mocking
import daoRouter from '../../src/routes/dao';

describe('DAO Routes', () => {
  let app: express.Application;
  const mockDb = db as jest.Mocked<typeof db>;
  const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
  const mockReferendum = Referendum as jest.Mocked<typeof Referendum>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());
    app.use('/dao', daoRouter);
  });

  describe('GET /dao/members', () => {
    it('should return multisig members successfully', async () => {
          const mockMembers = [
      { wallet_address: '1Address1', team_member_name: 'Alice', network: 'Polkadot' as const },
      { wallet_address: '1Address2', team_member_name: 'Bob', network: 'Polkadot' as const }
    ];

      mockMultisigService.getCachedTeamMembers.mockResolvedValue(mockMembers);

      const response = await request(app)
        .get('/dao/members')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        members: [
          { address: '1Address1', name: 'Alice', network: 'Polkadot' },
          { address: '1Address2', name: 'Bob', network: 'Polkadot' }
        ]
      });
    });

    it('should handle members without names', async () => {
          const mockMembers = [
      { wallet_address: '1Address1', team_member_name: 'Multisig Member (Polkadot)', network: 'Polkadot' as const }
    ];

      mockMultisigService.getCachedTeamMembers.mockResolvedValue(mockMembers);

      const response = await request(app)
        .get('/dao/members')
        .expect(200);

      expect(response.body.members[0].name).toBe('Multisig Member (Polkadot)');
    });

    it('should handle service errors', async () => {
      mockMultisigService.getCachedTeamMembers.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .get('/dao/members')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  describe('GET /dao/parent', () => {
    it('should return parent address information', async () => {
      const mockParentInfo = {
        isProxy: true,
        parentAddress: '1ParentAddress',
        currentAddress: '1CurrentAddress',
        network: 'Polkadot'
      };

      mockMultisigService.getParentAddress.mockResolvedValue(mockParentInfo);

      const response = await request(app)
        .get('/dao/parent')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        parent: mockParentInfo
      });
    });

    it('should handle service errors', async () => {
      mockMultisigService.getParentAddress.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .get('/dao/parent')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  // Tests for GET /dao/referendum/:referendumId, POST /dao/referendum/:referendumId/action,
  // and DELETE /dao/referendum/:referendumId/action have been moved to routes.referendums.test.ts
  // as these endpoints are now handled by /referendums/* routes
}); 