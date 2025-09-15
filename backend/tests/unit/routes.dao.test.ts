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

  describe('GET /dao/referendum/:referendumId', () => {
    const mockReferendum = {
      id: 1,
      post_id: 123,
      chain: 'Polkadot',
      title: 'Test Referendum',
      description: 'Test description',
      necessity_score: 4,
      funding_score: 3,
      ref_score: 3.5,
      suggested_vote: '👍 Aye 👍',
      final_vote: null,
      vote_executed: false
    };

    const mockAssignments = [
      { team_member_id: '1Address1', role_type: 'responsible_person', reason: null, created_at: '2024-01-01T00:00:00Z', assigned_to: '1Address1' },
      { team_member_id: '1Address2', role_type: 'agree', reason: 'Good proposal', created_at: '2024-01-01T01:00:00Z', assigned_to: null }
    ];

    it('should return referendum with team assignments', async () => {
      mockDb.get.mockResolvedValue(mockReferendum);
      mockDb.all.mockResolvedValue(mockAssignments);

      const response = await request(app)
        .get('/dao/referendum/123?chain=Polkadot')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        referendum: {
          ...mockReferendum,
          assigned_to: '1Address1', // The responsible person's wallet address
          team_assignments: mockAssignments
        }
      });

      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['123', 'Polkadot']
      );
    });

    it('should require chain parameter', async () => {
      const response = await request(app)
        .get('/dao/referendum/123')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Chain parameter is required'
      });
    });

    it('should handle non-existent referendum', async () => {
      mockDb.get.mockResolvedValue(null);

      const response = await request(app)
        .get('/dao/referendum/999?chain=Polkadot')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Referendum 999 not found on Polkadot network'
      });
    });
  });

  describe('POST /dao/referendum/:referendumId/action', () => {
    it('should assign responsible person successfully', async () => {
      mockDb.get
        .mockResolvedValueOnce({ id: 1, title: 'Test Referendum' }) // Referendum exists
        .mockResolvedValueOnce(null) // No existing action
        .mockResolvedValueOnce(null); // No current responsible person
      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 } as any);

      const actionData = {
        action: 'responsible_person',
        chain: 'Polkadot',
        reason: 'Taking responsibility for evaluation'
      };

      const response = await request(app)
        .post('/dao/referendum/123/action')
        .send(actionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Governance action assigned successfully');
    });

    it('should record agreement action', async () => {
      mockDb.get
        .mockResolvedValueOnce({ id: 1, title: 'Test Referendum' }) // Referendum exists
        .mockResolvedValueOnce(null); // No existing action
      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 } as any);

      const actionData = {
        action: 'agree',
        chain: 'Polkadot',
        reason: 'This proposal looks good'
      };

      const response = await request(app)
        .post('/dao/referendum/123/action')
        .send(actionData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should validate action parameter', async () => {
      const invalidActionData = {
        action: 'invalid_action',
        chain: 'Polkadot'
      };

      const response = await request(app)
        .post('/dao/referendum/123/action')
        .send(invalidActionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Valid action is required');
    });

    it('should require chain parameter', async () => {
      const actionData = {
        action: 'agree'
      };

      const response = await request(app)
        .post('/dao/referendum/123/action')
        .send(actionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Chain parameter is required');
    });

    it('should handle non-existent referendum', async () => {
      mockDb.get.mockResolvedValue(null); // Referendum doesn't exist

      const actionData = {
        action: 'agree',
        chain: 'Polkadot'
      };

      const response = await request(app)
        .post('/dao/referendum/999/action')
        .send(actionData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Referendum 999 not found on Polkadot network');
    });
  });

  describe('DELETE /dao/referendum/:referendumId/action', () => {
    it('should remove action successfully', async () => {
      mockDb.get.mockResolvedValue({ id: 1, title: 'Test Referendum' }); // Referendum exists
      mockDb.run.mockResolvedValue({ changes: 1 } as any); // Action removed

      const response = await request(app)
        .delete('/dao/referendum/123/action')
        .send({ chain: 'Polkadot' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Governance action removed successfully');
    });

    it('should handle non-existent action', async () => {
      mockDb.get.mockResolvedValue({ id: 1, title: 'Test Referendum' }); // Referendum exists
      mockDb.run.mockResolvedValue({ changes: 0 } as any); // No action to remove

      const response = await request(app)
        .delete('/dao/referendum/123/action')
        .send({ chain: 'Polkadot' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No governance action found for this user and referendum');
    });

    it('should require chain parameter', async () => {
      const response = await request(app)
        .delete('/dao/referendum/123/action')
        .send({}) // No chain parameter
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Chain parameter is required');
    });
  });
}); 