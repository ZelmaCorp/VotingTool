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
jest.mock('../../src/database/models/votingDecision');

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
import referendumsRouter from '../../src/routes/referendums';

describe('Referendums Routes', () => {
  let app: express.Application;
  const mockDb = db as jest.Mocked<typeof db>;
  const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
  const mockReferendum = Referendum as jest.Mocked<typeof Referendum>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());
    app.use('/referendums', referendumsRouter);
  });

  describe('GET /referendums/:postId/actions', () => {
    const mockActions = [
      { id: 1, referendum_id: 1, team_member_id: '1Address1', role_type: 'responsible_person', reason: null, created_at: '2024-01-01T00:00:00Z' },
      { id: 2, referendum_id: 1, team_member_id: '1Address2', role_type: 'agree', reason: 'Good proposal', created_at: '2024-01-01T01:00:00Z' }
    ];

    const mockTeamMembers = [
      { wallet_address: '1Address1', team_member_name: 'Alice', network: 'Polkadot' as const },
      { wallet_address: '1Address2', team_member_name: 'Bob', network: 'Polkadot' as const }
    ];

    it('should return team actions for a referendum', async () => {
      mockReferendum.findByPostIdAndChain.mockResolvedValue({ id: 1, post_id: 123, chain: 'Polkadot' } as any);
      mockDb.all.mockResolvedValue(mockActions);
      mockMultisigService.getCachedTeamMembers.mockResolvedValue(mockTeamMembers);

      const response = await request(app)
        .get('/referendums/123/actions?chain=Polkadot')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.actions).toHaveLength(2);
      expect(response.body.actions[0]).toHaveProperty('team_member_name');
    });

    it('should require chain parameter', async () => {
      const response = await request(app)
        .get('/referendums/123/actions')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('chain parameter is required');
    });

    it('should handle non-existent referendum', async () => {
      mockReferendum.findByPostIdAndChain.mockResolvedValue(null);

      const response = await request(app)
        .get('/referendums/999/actions?chain=Polkadot')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('POST /referendums/:postId/actions', () => {
    beforeEach(() => {
      mockReferendum.findByPostIdAndChain.mockResolvedValue({ id: 1, post_id: 123, chain: 'Polkadot' } as any);
      mockDb.get.mockResolvedValue(null); // No existing action
      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 } as any);
      mockMultisigService.getCachedTeamMembers.mockResolvedValue([
        { wallet_address: '1Address1', team_member_name: 'Alice', network: 'Polkadot' as const }
      ]);
      mockDb.all.mockResolvedValue([]); // No existing actions for agreement check
    });

    it('should add team action successfully', async () => {
      const actionData = {
        action: 'agree',
        chain: 'Polkadot',
        reason: 'This proposal looks good'
      };

      const response = await request(app)
        .post('/referendums/123/actions')
        .send(actionData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');
    });

    it('should validate action parameter', async () => {
      const invalidActionData = {
        action: 'invalid_action',
        chain: 'Polkadot'
      };

      const response = await request(app)
        .post('/referendums/123/actions')
        .send(invalidActionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Valid action is required');
    });

    it('should require chain parameter', async () => {
      const actionData = {
        action: 'agree'
      };

      const response = await request(app)
        .post('/referendums/123/actions')
        .send(actionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Chain parameter is required');
    });

    it('should handle non-existent referendum', async () => {
      mockReferendum.findByPostIdAndChain.mockResolvedValue(null);

      const actionData = {
        action: 'agree',
        chain: 'Polkadot'
      };

      const response = await request(app)
        .post('/referendums/999/actions')
        .send(actionData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('DELETE /referendums/:postId/actions', () => {
    beforeEach(() => {
      mockReferendum.findByPostIdAndChain.mockResolvedValue({ id: 1, post_id: 123, chain: 'Polkadot' } as any);
      mockMultisigService.getCachedTeamMembers.mockResolvedValue([
        { wallet_address: '1Address1', team_member_name: 'Alice', network: 'Polkadot' as const }
      ]);
      mockDb.all.mockResolvedValue([]); // No remaining actions for agreement check
    });

    it('should remove action successfully', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      const response = await request(app)
        .delete('/referendums/123/actions')
        .send({ chain: 'Polkadot', action: 'agree' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');
    });

    it('should handle non-existent action', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 } as any);

      const response = await request(app)
        .delete('/referendums/123/actions')
        .send({ chain: 'Polkadot', action: 'agree' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('action found');
    });

    it('should require chain parameter', async () => {
      const response = await request(app)
        .delete('/referendums/123/actions')
        .send({ action: 'agree' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Chain parameter is required');
    });
  });
});

