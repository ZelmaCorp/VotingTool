import { RateLimitHandler } from '../../src/utils/rateLimitHandler';
import { RATE_LIMIT_CONFIGS } from '../../src/config/rate-limit-config';

describe('Rate Limiting Demo', () => {
  let handler: RateLimitHandler;

  beforeEach(() => {
    handler = RateLimitHandler.getInstance();
    // Clear any existing queue state
    (handler as any).requestQueue.clear();
  });

  describe('Basic functionality demonstration', () => {
    it('should successfully execute a simple operation', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');
      const config = RATE_LIMIT_CONFIGS.interactive;

      const result = await handler.executeWithRateLimit(mockOperation, config);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should demonstrate retry logic with simulated rate limits', async () => {
      let callCount = 0;
      const mockOperation = jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount <= 2) {
          // Simulate rate limit for first 2 calls
          throw { status: 429, message: 'Rate limited' };
        }
        return 'success-after-retries';
      });

      const config = { 
        ...RATE_LIMIT_CONFIGS.interactive,
        baseDelay: 100, // Shorter delay for testing
        maxDelay: 500 
      };

      const startTime = Date.now();
      const result = await handler.executeWithRateLimit(mockOperation, config);
      const elapsed = Date.now() - startTime;

      expect(result).toBe('success-after-retries');
      expect(mockOperation).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(elapsed).toBeGreaterThan(200); // Should have waited at least 200ms total
    });

    it('should demonstrate exponential backoff', async () => {
      const delays: number[] = [];
      let callCount = 0;

      const mockOperation = jest.fn().mockImplementation(async () => {
        callCount++;
        delays.push(Date.now());
        
        if (callCount <= 2) {
          throw { status: 429, message: 'Rate limited' };
        }
        return 'backoff-success';
      });

      const config = {
        ...RATE_LIMIT_CONFIGS.interactive,
        baseDelay: 200,
        backoffMultiplier: 2,
        maxDelay: 1000
      };

      const result = await handler.executeWithRateLimit(mockOperation, config);

      expect(result).toBe('backoff-success');
      expect(delays).toHaveLength(3);
      
      // Check that delays are increasing (exponential backoff)
      const delay1 = delays[1] - delays[0];
      const delay2 = delays[2] - delays[1];
      expect(delay2).toBeGreaterThan(delay1);
    });

    it('should demonstrate different operation types', async () => {
      const interactiveOp = jest.fn().mockResolvedValue('interactive-result');
      const bulkOp = jest.fn().mockResolvedValue('bulk-result');
      const criticalOp = jest.fn().mockResolvedValue('critical-result');

      // Execute with different configurations
      const interactiveResult = await handler.executeWithRateLimit(
        interactiveOp, 
        RATE_LIMIT_CONFIGS.interactive
      );
      const bulkResult = await handler.executeWithRateLimit(
        bulkOp, 
        RATE_LIMIT_CONFIGS.bulk
      );
      const criticalResult = await handler.executeWithRateLimit(
        criticalOp, 
        RATE_LIMIT_CONFIGS.critical
      );

      expect(interactiveResult).toBe('interactive-result');
      expect(bulkResult).toBe('bulk-result');
      expect(criticalResult).toBe('critical-result');

      // Verify different retry limits
      expect(RATE_LIMIT_CONFIGS.interactive.maxRetries).toBe(2);
      expect(RATE_LIMIT_CONFIGS.bulk.maxRetries).toBe(5);
      expect(RATE_LIMIT_CONFIGS.critical.maxRetries).toBe(8);
    });

    it('should demonstrate deduplication preventing duplicate calls', async () => {
      let executionCount = 0;
      const mockOperation = jest.fn().mockImplementation(async () => {
        executionCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
        return `result-${executionCount}`;
      });

      const config = RATE_LIMIT_CONFIGS.interactive;

      // Start two identical operations simultaneously
      const promise1 = handler.executeWithDeduplication(mockOperation, config, 'same-key');
      const promise2 = handler.executeWithDeduplication(mockOperation, config, 'same-key');

      const [result1, result2] = await Promise.all([promise1, promise2]);

      // Both should get the same result
      expect(result1).toBe('result-1');
      expect(result2).toBe('result-1');
      
      // But operation should only execute once
      expect(executionCount).toBe(1);
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should demonstrate queue monitoring', async () => {
      const slowOperation = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return 'slow-result';
      });

      const config = RATE_LIMIT_CONFIGS.interactive;

      // Start operation but don't await
      const promise = handler.executeWithDeduplication(slowOperation, config, 'monitor-test');

      // Check status while running
      const statusDuringExecution = handler.getQueueStatus();
      expect(statusDuringExecution.active).toBe(1);
      expect(statusDuringExecution.operations).toContain('monitor-test');

      // Wait for completion
      const result = await promise;

      // Check status after completion
      const statusAfterCompletion = handler.getQueueStatus();
      expect(statusAfterCompletion.active).toBe(0);
      expect(statusAfterCompletion.operations).not.toContain('monitor-test');
      expect(result).toBe('slow-result');
    });
  });

  describe('Error handling demonstration', () => {
    it('should immediately fail on non-rate-limit errors', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      const config = RATE_LIMIT_CONFIGS.interactive;

      await expect(handler.executeWithRateLimit(mockOperation, config))
        .rejects.toThrow('Database connection failed');
      
      // Should not retry non-rate-limit errors
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should respect Retry-After headers', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce({
          status: 429,
          headers: { 'retry-after': '1' }, // 1 second
          message: 'Rate limited'
        })
        .mockResolvedValueOnce('success-after-retry-after');

      const config = { ...RATE_LIMIT_CONFIGS.interactive, respectRetryAfter: true };
      const startTime = Date.now();

      const result = await handler.executeWithRateLimit(mockOperation, config);
      const elapsed = Date.now() - startTime;

      expect(result).toBe('success-after-retry-after');
      expect(elapsed).toBeGreaterThanOrEqual(900); // Should wait ~1 second
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });
  });

  describe('Real-world scenario simulation', () => {
    it('should handle a typical bulk operation scenario', async () => {
      // Simulate processing 10 items with occasional rate limits
      const items = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
      const results: any[] = [];
      
      let totalCalls = 0;
      const mockProcessor = jest.fn().mockImplementation(async (item: any) => {
        totalCalls++;
        
        // Simulate rate limit on every 4th call
        if (totalCalls % 4 === 0) {
          throw { status: 429, message: 'Rate limited' };
        }
        
        return `processed-${item.id}`;
      });

      const config = {
        ...RATE_LIMIT_CONFIGS.bulk,
        baseDelay: 50, // Faster for testing
        maxDelay: 200
      };

      // Process items sequentially with rate limiting
      for (const item of items) {
        try {
          const result = await handler.executeWithRateLimit(
            () => mockProcessor(item),
            config,
            `process-item-${item.id}`
          );
          results.push({ success: true, data: result, item });
        } catch (error) {
          results.push({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            item 
          });
        }
      }

      // All items should be processed successfully due to retries
      expect(results.every(r => r.success)).toBe(true);
      expect(results).toHaveLength(10);
      
      // Should have made more calls than items due to retries
      expect(totalCalls).toBeGreaterThan(10);
    });
  });
}); 