import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { db } from '../../src/database/connection';
import { Referendum } from '../../src/database/models/referendum';
import { multisigService } from '../../src/services/multisig';
import daoRouter from '../../src/routes/dao';

// Mock auth middleware for testing
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { address: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg', name: 'Test User' };
    next();
  },
  requireTeamMember: (req: any, res: any, next: any) => {
    req.user = { address: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg', name: 'Test User' };
    next();
  }
}));

describe('DAO Workflow Integration', () => {
  let app: Express;
  let authToken: string;
  let testReferendumId: number;
  let testPostId: number = Date.now(); // Use timestamp for unique ID
  const testChain = 'Polkadot';
  const testUserAddress = '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg'; // Example Polkadot address

  beforeAll(async () => {
    // Initialize database for integration testing
    await db.initialize();
    
    // Clean up any existing test data first
    await db.run('DELETE FROM referendum_team_roles WHERE referendum_id IN (SELECT id FROM referendums WHERE post_id = ? AND chain = ?)', [testPostId, testChain]);
    await db.run('DELETE FROM referendums WHERE post_id = ? AND chain = ?', [testPostId, testChain]);
    
    // Create Express app with DAO routes
    app = express();
    app.use(bodyParser.json());
    app.use('/dao', daoRouter);
    
    // Create a test referendum
    testReferendumId = await Referendum.create({
      post_id: testPostId,
      chain: testChain as any,
      title: 'Test Referendum for DAO Workflow',
      description: 'Integration test referendum',
      internal_status: 'Waiting for agreement' as any,
      created_at: new Date().toISOString()
    });

    // Mock authentication token (in real scenario, would get this from auth endpoint)
    authToken = 'test-auth-token';
    
    // Mock the multisig service to return test team members
    jest.spyOn(multisigService, 'getCachedTeamMembers').mockResolvedValue([
      {
        wallet_address: testUserAddress,
        team_member_name: 'Test Member 1',
        network: 'Polkadot'
      },
      {
        wallet_address: '1ABC123...',
        team_member_name: 'Test Member 2', 
        network: 'Polkadot'
      },
      {
        wallet_address: '1XYZ789...',
        team_member_name: 'Test Member 3',
        network: 'Polkadot'
      }
    ]);
  });

  afterAll(async () => {
    // Clean up test data
    await db.run('DELETE FROM referendum_team_roles WHERE referendum_id = ?', [testReferendumId]);
    await db.run('DELETE FROM referendums WHERE id = ?', [testReferendumId]);
    
    // Close database connection
    await db.close();
    jest.restoreAllMocks();
  });

  it('should complete full referendum workflow: assignment → agreement → ready-to-vote', async () => {
    // Step 1: Assign responsible person
    const assignResponse = await request(app)
      .post(`/dao/referendum/${testPostId}/action`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        action: 'responsible_person',
        chain: testChain,
        reason: 'Taking responsibility for this proposal'
      });

    expect(assignResponse.status).toBe(201);
    expect(assignResponse.body.success).toBe(true);
    expect(assignResponse.body.action.action).toBe('responsible_person');

    // Step 2: Get referendum details to verify assignment
    const referendumResponse = await request(app)
      .get(`/dao/referendum/${testPostId}`)
      .query({ chain: testChain });

    expect(referendumResponse.status).toBe(200);
    expect(referendumResponse.body.success).toBe(true);
    expect(referendumResponse.body.referendum.assigned_to).toBe(testUserAddress);

    // Step 3: Add team agreements (simulate multiple team members agreeing)
    const agreeResponse1 = await request(app)
      .post(`/dao/referendum/${testPostId}/action`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        action: 'agree',
        chain: testChain,
        reason: 'Good proposal, I support it'
      });

    expect(agreeResponse1.status).toBe(200); // Should update existing action
    expect(agreeResponse1.body.success).toBe(true);

    // Step 4: Check agreement summary
    const summaryResponse = await request(app)
      .get(`/dao/referendum/${testPostId}/agreement-summary`)
      .query({ chain: testChain });

    expect(summaryResponse.status).toBe(200);
    expect(summaryResponse.body.success).toBe(true);
    expect(summaryResponse.body.summary.total_agreements).toBeGreaterThan(0);
    expect(summaryResponse.body.summary.agreed_members).toHaveLength(1);
    expect(summaryResponse.body.summary.vetoed).toBe(false);

    // Step 5: Check workflow data
    const workflowResponse = await request(app)
      .get('/dao/workflow')
      .set('Authorization', `Bearer ${authToken}`);

    expect(workflowResponse.status).toBe(200);
    expect(workflowResponse.body.success).toBe(true);
    expect(workflowResponse.body.data).toHaveProperty('needsAgreement');
    expect(workflowResponse.body.data).toHaveProperty('readyToVote');
    expect(workflowResponse.body.data).toHaveProperty('forDiscussion');
    expect(workflowResponse.body.data).toHaveProperty('vetoedProposals');

    // Step 6: Get team actions for this referendum
    const actionsResponse = await request(app)
      .get(`/dao/referendum/${testPostId}/actions`)
      .query({ chain: testChain });

    expect(actionsResponse.status).toBe(200);
    expect(actionsResponse.body.success).toBe(true);
    expect(actionsResponse.body.actions).toBeInstanceOf(Array);
    expect(actionsResponse.body.actions.length).toBeGreaterThan(0);

    // Verify the action has team member information
    const action = actionsResponse.body.actions[0];
    expect(action).toHaveProperty('team_member_name');
    expect(action).toHaveProperty('wallet_address');
    expect(action.role_type).toBe('agree');
  }, 30000); // 30 second timeout for this comprehensive test
}); 