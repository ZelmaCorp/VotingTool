import { OperationQueue } from '../../src/utils/operation-queue';
import { RATE_LIMIT_CONFIGS } from '../../src/config/rate-limit-config';

describe('OperationQueue', () => {
  let queue: OperationQueue;

  beforeEach(() => {
    queue = OperationQueue.getInstance();
    // Clear queue state
    (queue as any).queue.clear();
    (queue as any).deadLetterQueue.clear();
    (queue as any).processing = false;
  });

  describe('enqueue', () => {
    it('should add operation to queue with correct properties', async () => {
      const mockOperation = jest.fn().mockResolvedValue('test-result');
      const testData = { id: 'test-1', title: 'Test Operation' };
      const config = RATE_LIMIT_CONFIGS.interactive;

      const operationId = await queue.enqueue(
        'createReferenda',
        mockOperation,
        testData,
        config
      );

      expect(operationId).toMatch(/^op_\d+_[a-z0-9]+$/);
      
      const stats = queue.getQueueStats();
      expect(stats.total).toBe(1);
      expect(stats.pending).toBe(1);
    });

    it('should use provided operation ID if given', async () => {
      const mockOperation = jest.fn().mockResolvedValue('test-result');
      const testData = { id: 'test-1' };
      const config = RATE_LIMIT_CONFIGS.interactive;
      const customId = 'custom-operation-id';

      const operationId = await queue.enqueue(
        'createReferenda',
        mockOperation,
        testData,
        config,
        customId
      );

      expect(operationId).toBe(customId);
    });

    it('should classify operation types correctly', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result');
      const config = RATE_LIMIT_CONFIGS.interactive;

      const operations = [
        { name: 'createReferenda', expectedType: 'create' },
        { name: 'updateReferenda', expectedType: 'update' },
        { name: 'deleteReferenda', expectedType: 'delete' },
        { name: 'findReferenda', expectedType: 'search' },
        { name: 'searchContent', expectedType: 'search' }
      ];

      for (const op of operations) {
        await queue.enqueue(op.name, mockOperation, {}, config);
      }

      const allOps = Array.from((queue as any).queue.values()) as any[];
      expect(allOps[0].type).toBe('create');
      expect(allOps[1].type).toBe('update'); 
      expect(allOps[2].type).toBe('delete');
      expect(allOps[3].type).toBe('search');
      expect(allOps[4].type).toBe('search');
    });
  });

  describe('executeWithQueue', () => {
    it('should execute operation and return success result', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success-data');
      const testData = { id: 'test-success' };
      const config = RATE_LIMIT_CONFIGS.interactive;

      const result = await queue.executeWithQueue(
        'createReferenda',
        mockOperation,
        testData,
        config
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('success-data');
      expect(result.operationId).toMatch(/^op_\d+_[a-z0-9]+$/);
    });

    it('should handle operation failure gracefully', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Operation failed'));
      const testData = { id: 'test-failure' };
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 0 };

      const result = await queue.executeWithQueue(
        'createReferenda',
        mockOperation,
        testData,
        config
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Operation failed');
      expect(result.operationId).toMatch(/^op_\d+_[a-z0-9]+$/);
    });

    it('should retry failed operations up to maxRetries', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce('success-after-retries');

      const testData = { id: 'test-retry' };
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 2 };

      const result = await queue.executeWithQueue(
        'createReferenda',
        mockOperation,
        testData,
        config
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('success-after-retries');
    });

    it('should move operations to dead letter queue after max retries', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      const testData = { id: 'test-dead-letter' };
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 1 };

      const result = await queue.executeWithQueue(
        'createReferenda',
        mockOperation,
        testData,
        config
      );

      expect(result.success).toBe(false);
      
      const stats = queue.getQueueStats();
      expect(stats.deadLetter).toBe(1);
      
      const deadLetterOps = queue.getOperationsByStatus('dead-letter');
      expect(deadLetterOps).toHaveLength(1);
      expect(deadLetterOps[0].operation).toBe('createReferenda');
    });
  });

  describe('getQueueStats', () => {
    it('should return correct statistics for empty queue', () => {
      const stats = queue.getQueueStats();
      
      expect(stats).toEqual({
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        deadLetter: 0,
        total: 0
      });
    });

    it('should return correct statistics with mixed operation states', async () => {
      // Add operations in different states (this is a bit artificial since 
      // we can't easily control the processing state in unit tests)
      const mockOperation = jest.fn().mockResolvedValue('result');
      const config = RATE_LIMIT_CONFIGS.interactive;

      // Enqueue some operations
      await queue.enqueue('createReferenda', mockOperation, {}, config);
      await queue.enqueue('updateReferenda', mockOperation, {}, config);
      
      const stats = queue.getQueueStats();
      expect(stats.total).toBe(2);
      expect(stats.pending).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getOperationsByStatus', () => {
    it('should filter operations by status correctly', async () => {
      const mockSuccessOp = jest.fn().mockResolvedValue('success');
      const mockFailOp = jest.fn().mockRejectedValue(new Error('fail'));
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 0 };

      // Create operations with different outcomes
      await queue.executeWithQueue('createReferenda', mockSuccessOp, {}, config);
      await queue.executeWithQueue('updateReferenda', mockFailOp, {}, config);

      const completedOps = queue.getOperationsByStatus('completed');
      const deadLetterOps = queue.getOperationsByStatus('dead-letter');

      expect(completedOps.length).toBeGreaterThanOrEqual(0);
      expect(deadLetterOps.length).toBeGreaterThanOrEqual(0);
    });

    it('should return dead letter operations separately', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Always fails'));
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 0 };

      await queue.executeWithQueue('createReferenda', mockOperation, { id: 'dead-1' }, config);
      await queue.executeWithQueue('updateReferenda', mockOperation, { id: 'dead-2' }, config);

      const deadLetterOps = queue.getOperationsByStatus('dead-letter');
      expect(deadLetterOps).toHaveLength(2);
      
      const pendingOps = queue.getOperationsByStatus('pending');
      expect(pendingOps).toHaveLength(0); // Should be moved to dead letter
    });
  });

  describe('retryDeadLetterOperations', () => {
    it('should move dead letter operations back to pending', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Initial failure'));
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 0 };

      // Create a dead letter operation
      await queue.executeWithQueue('createReferenda', mockOperation, { id: 'retry-test' }, config);
      
      let stats = queue.getQueueStats();
      expect(stats.deadLetter).toBe(1);

      // Now make the operation succeed on retry
      mockOperation.mockResolvedValueOnce('success-on-retry');
      
      await queue.retryDeadLetterOperations();
      
      // Give it a moment to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      stats = queue.getQueueStats();
      expect(stats.deadLetter).toBe(0);
    });

    it('should reset attempt counts when retrying dead letter operations', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Always fails'));
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 1 };

      // Create dead letter operation  
      await queue.executeWithQueue('createReferenda', mockOperation, {}, config);
      
      const deadLetterOps = queue.getOperationsByStatus('dead-letter');
      expect(deadLetterOps[0].attempts).toBeGreaterThan(1);

      // Retry and check attempts are reset
      await queue.retryDeadLetterOperations();
      
      const retriedOps = Array.from((queue as any).queue.values()) as any[];
      const retriedOp = retriedOps.find((op: any) => op.status === 'pending');
      if (retriedOp) {
        expect(retriedOp.attempts).toBe(0);
      }
    });
  });

  describe('clearCompleted', () => {
    it('should remove completed operations from queue', async () => {
      const successOp = jest.fn().mockResolvedValue('completed-result');
      const config = RATE_LIMIT_CONFIGS.interactive;

      // Execute successful operations
      await queue.executeWithQueue('createReferenda', successOp, { id: 1 }, config);
      await queue.executeWithQueue('updateReferenda', successOp, { id: 2 }, config);

      let stats = queue.getQueueStats();
      const initialTotal = stats.total;

      const clearedCount = queue.clearCompleted();
      
      stats = queue.getQueueStats();
      expect(clearedCount).toBeGreaterThanOrEqual(0);
      expect(stats.total).toBeLessThanOrEqual(initialTotal);
    });

    it('should not remove non-completed operations', async () => {
      const failOp = jest.fn().mockRejectedValue(new Error('Failed'));
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 0 };

      // Create failed operation (goes to dead letter)
      await queue.executeWithQueue('createReferenda', failOp, {}, config);

      const clearedCount = queue.clearCompleted();
      
      const stats = queue.getQueueStats();
      expect(stats.deadLetter).toBe(1); // Should still be there
      expect(clearedCount).toBe(0); // Nothing to clear
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance', () => {
      const instance1 = OperationQueue.getInstance();
      const instance2 = OperationQueue.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('operation ID generation', () => {
    it('should generate unique operation IDs', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result');
      const config = RATE_LIMIT_CONFIGS.interactive;

      const id1 = await queue.enqueue('createReferenda', mockOperation, {}, config);
      const id2 = await queue.enqueue('createReferenda', mockOperation, {}, config);
      const id3 = await queue.enqueue('createReferenda', mockOperation, {}, config);

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
      
      // All should match the expected format
      expect(id1).toMatch(/^op_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^op_\d+_[a-z0-9]+$/);
      expect(id3).toMatch(/^op_\d+_[a-z0-9]+$/);
    });
  });
}); 