import { RateLimitHandler, RateLimitError } from '../../src/utils/rateLimitHandler';
import { RATE_LIMIT_CONFIGS } from '../../src/config/rate-limit-config';

describe('RateLimitHandler', () => {
  let handler: RateLimitHandler;

  beforeEach(() => {
    handler = RateLimitHandler.getInstance();
    // Clear any existing queue state
    (handler as any).requestQueue.clear();
  });

  describe('executeWithRateLimit', () => {
    it('should execute operation successfully on first attempt', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');
      const config = RATE_LIMIT_CONFIGS.interactive;

      const result = await handler.executeWithRateLimit(mockOperation, config);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should retry on rate limit error and eventually succeed', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce({ status: 429, message: 'Rate limited' })
        .mockResolvedValueOnce('success');
      
      const config = RATE_LIMIT_CONFIGS.interactive;

      const result = await handler.executeWithRateLimit(mockOperation, config);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    it('should respect Retry-After header when present', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce({ 
          status: 429, 
          headers: { 'retry-after': '2' },
          message: 'Rate limited' 
        })
        .mockResolvedValueOnce('success');
      
      const config = { ...RATE_LIMIT_CONFIGS.interactive, respectRetryAfter: true };
      const startTime = Date.now();

      const result = await handler.executeWithRateLimit(mockOperation, config);

      const elapsed = Date.now() - startTime;
      expect(result).toBe('success');
      expect(elapsed).toBeGreaterThanOrEqual(1900); // Should wait ~2 seconds
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    it('should throw RateLimitError after max retries exceeded', async () => {
      const mockOperation = jest.fn().mockRejectedValue({ 
        status: 429, 
        message: 'Rate limited' 
      });
      
      const config = { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 1 };

      await expect(handler.executeWithRateLimit(mockOperation, config))
        .rejects.toThrow(RateLimitError);
      
      expect(mockOperation).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should immediately throw non-rate-limit errors', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Database error'));
      const config = RATE_LIMIT_CONFIGS.interactive;

      await expect(handler.executeWithRateLimit(mockOperation, config))
        .rejects.toThrow('Database error');
      
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff for retry delays', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValueOnce({ status: 429 })
        .mockRejectedValueOnce({ status: 429 })
        .mockResolvedValueOnce('success');
      
      const config = {
        ...RATE_LIMIT_CONFIGS.interactive,
        baseDelay: 1000,
        backoffMultiplier: 2,
        maxRetries: 2
      };

      const startTime = Date.now();
      const result = await handler.executeWithRateLimit(mockOperation, config);
      const elapsed = Date.now() - startTime;

      expect(result).toBe('success');
      // Should have waited: ~1s + ~2s = ~3s total
      expect(elapsed).toBeGreaterThanOrEqual(2900);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('should detect various rate limit error formats', async () => {
      const errorFormats = [
        { status: 429 },
        { code: 429 },
        { message: 'rate limit exceeded' },
        { message: 'Too many requests' },
        { message: 'HTTP error 429' }
      ];

      for (const error of errorFormats) {
        const mockOperation = jest.fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValueOnce('success');
        
        const result = await handler.executeWithRateLimit(
          mockOperation, 
          { ...RATE_LIMIT_CONFIGS.interactive, maxRetries: 1 }
        );

        expect(result).toBe('success');
        expect(mockOperation).toHaveBeenCalledTimes(2);
        mockOperation.mockClear();
      }
    });
  });

  describe('executeWithDeduplication', () => {
    it('should execute operation once for unique keys', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result1');
      const config = RATE_LIMIT_CONFIGS.interactive;

      const result1 = await handler.executeWithDeduplication(
        mockOperation, 
        config, 
        'unique-key-1'
      );
      const result2 = await handler.executeWithDeduplication(
        mockOperation, 
        config, 
        'unique-key-2'
      );

      expect(result1).toBe('result1');
      expect(result2).toBe('result1');
      expect(mockOperation).toHaveBeenCalledTimes(2);
    });

    it('should deduplicate identical operations', async () => {
      const mockOperation = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'deduped-result';
      });
      const config = RATE_LIMIT_CONFIGS.interactive;

      // Start two identical operations simultaneously
      const promise1 = handler.executeWithDeduplication(
        mockOperation, 
        config, 
        'same-key'
      );
      const promise2 = handler.executeWithDeduplication(
        mockOperation, 
        config, 
        'same-key'
      );

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('deduped-result');
      expect(result2).toBe('deduped-result');
      expect(mockOperation).toHaveBeenCalledTimes(1); // Only called once due to deduplication
    });

    it('should clean up queue after operation completes', async () => {
      const mockOperation = jest.fn().mockResolvedValue('cleanup-test');
      const config = RATE_LIMIT_CONFIGS.interactive;

      await handler.executeWithDeduplication(mockOperation, config, 'cleanup-key');
      
      const queueStatus = handler.getQueueStatus();
      expect(queueStatus.active).toBe(0);
      expect(queueStatus.operations).not.toContain('cleanup-key');
    });
  });

  describe('getQueueStatus', () => {
    it('should return correct queue statistics', async () => {
      const slowOperation = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return 'slow-result';
      });
      const config = RATE_LIMIT_CONFIGS.interactive;

      // Start operations but don't await
      const promise1 = handler.executeWithDeduplication(slowOperation, config, 'slow-1');
      const promise2 = handler.executeWithDeduplication(slowOperation, config, 'slow-2');

      // Check status while operations are running
      const status = handler.getQueueStatus();
      expect(status.active).toBe(2);
      expect(status.operations).toContain('slow-1');
      expect(status.operations).toContain('slow-2');

      // Wait for completion
      await Promise.all([promise1, promise2]);

      // Check status after completion
      const finalStatus = handler.getQueueStatus();
      expect(finalStatus.active).toBe(0);
      expect(finalStatus.operations).toHaveLength(0);
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance', () => {
      const instance1 = RateLimitHandler.getInstance();
      const instance2 = RateLimitHandler.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
}); 