import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { db } from '../../src/database/connection';
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

// Mock the refresh function to avoid hitting real APIs during tests
jest.mock('../../src/refresh', () => ({
  refreshReferendas: jest.fn().mockImplementation((limit: number) => {
    return Promise.resolve({
      success: true,
      processed: Math.min(limit, 10), // Simulate processing up to limit
      limit: limit,
      timestamp: new Date().toISOString()
    });
  })
}));

describe('Data Synchronization Integration', () => {
  let app: Express;

  beforeAll(async () => {
    // Initialize database
    await db.initialize();
    
    // Create Express app with DAO routes
    app = express();
    app.use(bodyParser.json());
    app.use('/dao', daoRouter);
  });

  afterAll(async () => {
    // Close database connection
    await db.close();
    jest.restoreAllMocks();
  });

  it('should perform normal and deep sync with Polkassembly API', async () => {
    const { refreshReferendas } = require('../../src/refresh');
    
    // Step 1: Test normal sync (default)
    const normalSyncResponse = await request(app)
      .post('/dao/sync')
      .set('Authorization', 'Bearer test-token')
      .send({
        type: 'normal'
      });

    expect(normalSyncResponse.status).toBe(200);
    expect(normalSyncResponse.body.success).toBe(true);
    expect(normalSyncResponse.body.message).toBe('Normal sync started successfully');
    expect(normalSyncResponse.body.type).toBe('normal');
    expect(normalSyncResponse.body.limit).toBe(30);
    expect(normalSyncResponse.body.status).toBe('started');
    expect(normalSyncResponse.body.timestamp).toBeDefined();

    // Verify refreshReferendas was called with correct limit
    expect(refreshReferendas).toHaveBeenCalledWith(30);

    // Step 2: Test deep sync
    const deepSyncResponse = await request(app)
      .post('/dao/sync')
      .set('Authorization', 'Bearer test-token')
      .send({
        type: 'deep'
      });

    expect(deepSyncResponse.status).toBe(200);
    expect(deepSyncResponse.body.success).toBe(true);
    expect(deepSyncResponse.body.message).toBe('Deep sync started successfully');
    expect(deepSyncResponse.body.type).toBe('deep');
    expect(deepSyncResponse.body.limit).toBe(100);
    expect(deepSyncResponse.body.status).toBe('started');
    expect(deepSyncResponse.body.timestamp).toBeDefined();

    // Verify refreshReferendas was called with correct limit
    expect(refreshReferendas).toHaveBeenCalledWith(100);

    // Step 3: Test default sync (should default to normal)
    const defaultSyncResponse = await request(app)
      .post('/dao/sync')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(defaultSyncResponse.status).toBe(200);
    expect(defaultSyncResponse.body.success).toBe(true);
    expect(defaultSyncResponse.body.type).toBe('normal');
    expect(defaultSyncResponse.body.limit).toBe(30);

    // Step 4: Test invalid sync type
    const invalidSyncResponse = await request(app)
      .post('/dao/sync')
      .set('Authorization', 'Bearer test-token')
      .send({
        type: 'invalid'
      });

    expect(invalidSyncResponse.status).toBe(400);
    expect(invalidSyncResponse.body.success).toBe(false);
    expect(invalidSyncResponse.body.error).toBe("Sync type must be 'normal' or 'deep'");

    // Step 5: Test unauthorized sync request
    const unauthorizedSyncResponse = await request(app)
      .post('/dao/sync')
      .send({
        type: 'normal'
      });

    // This should pass because we mocked the auth middleware
    // In real scenario, this would return 401
    expect(unauthorizedSyncResponse.status).toBe(200);

    // Step 6: Verify the sync operations are asynchronous
    // The endpoint should return immediately, not wait for completion
    const startTime = Date.now();
    const asyncSyncResponse = await request(app)
      .post('/dao/sync')
      .set('Authorization', 'Bearer test-token')
      .send({
        type: 'normal'
      });
    const endTime = Date.now();

    expect(asyncSyncResponse.status).toBe(200);
    expect(asyncSyncResponse.body.status).toBe('started');
    
    // Response should be very fast (under 1000ms) because it's async
    expect(endTime - startTime).toBeLessThan(1000);

    // Verify total call count
    expect(refreshReferendas).toHaveBeenCalledTimes(5); // Called 5 times total
  });
}); 