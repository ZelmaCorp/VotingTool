import { 
  RATE_LIMIT_CONFIGS, 
  getRateLimitConfig, 
  createCustomConfig
} from '../../src/config/rate-limit-config';

describe('Rate Limit Configuration', () => {
  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have all required configuration types', () => {
      expect(RATE_LIMIT_CONFIGS).toHaveProperty('interactive');
      expect(RATE_LIMIT_CONFIGS).toHaveProperty('bulk');
      expect(RATE_LIMIT_CONFIGS).toHaveProperty('critical');
    });

    it('should have valid interactive configuration', () => {
      const config = RATE_LIMIT_CONFIGS.interactive;
      
      expect(config.maxRetries).toBe(2);
      expect(config.baseDelay).toBe(1000);
      expect(config.maxDelay).toBe(5000);
      expect(config.backoffMultiplier).toBe(2);
      expect(config.respectRetryAfter).toBe(true);
      expect(config.operationType).toBe('interactive');
    });

    it('should have valid bulk configuration', () => {
      const config = RATE_LIMIT_CONFIGS.bulk;
      
      expect(config.maxRetries).toBe(5);
      expect(config.baseDelay).toBe(2000);
      expect(config.maxDelay).toBe(30000);
      expect(config.backoffMultiplier).toBe(1.5);
      expect(config.respectRetryAfter).toBe(true);
      expect(config.operationType).toBe('bulk');
    });

    it('should have valid critical configuration', () => {
      const config = RATE_LIMIT_CONFIGS.critical;
      
      expect(config.maxRetries).toBe(8);
      expect(config.baseDelay).toBe(1500);
      expect(config.maxDelay).toBe(60000);
      expect(config.backoffMultiplier).toBe(1.8);
      expect(config.respectRetryAfter).toBe(true);
      expect(config.operationType).toBe('critical');
    });

    it('should have increasing retry aggressiveness: interactive < bulk < critical', () => {
      const interactive = RATE_LIMIT_CONFIGS.interactive;
      const bulk = RATE_LIMIT_CONFIGS.bulk;
      const critical = RATE_LIMIT_CONFIGS.critical;

      expect(interactive.maxRetries).toBeLessThan(bulk.maxRetries);
      expect(bulk.maxRetries).toBeLessThan(critical.maxRetries);
      
      expect(interactive.maxDelay).toBeLessThan(bulk.maxDelay);
      expect(bulk.maxDelay).toBeLessThan(critical.maxDelay);
    });
  });

  describe('getRateLimitConfig', () => {
    it('should return correct config for valid operation types', () => {
      const interactiveConfig = getRateLimitConfig('interactive');
      const bulkConfig = getRateLimitConfig('bulk');
      const criticalConfig = getRateLimitConfig('critical');

      expect(interactiveConfig).toBe(RATE_LIMIT_CONFIGS.interactive);
      expect(bulkConfig).toBe(RATE_LIMIT_CONFIGS.bulk);
      expect(criticalConfig).toBe(RATE_LIMIT_CONFIGS.critical);
    });

    it('should return interactive config and warn for unknown operation types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const config = getRateLimitConfig('unknown' as any);
      
      expect(config).toBe(RATE_LIMIT_CONFIGS.interactive);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unknown operation type: unknown, using interactive config'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('createCustomConfig', () => {
    it('should create config with overrides applied', () => {
      const customConfig = createCustomConfig({
        maxRetries: 10,
        baseDelay: 500,
        operationType: 'bulk'
      });

      expect(customConfig.maxRetries).toBe(10);
      expect(customConfig.baseDelay).toBe(500);
      expect(customConfig.operationType).toBe('bulk');
      
      // Should keep other defaults from interactive config
      expect(customConfig.maxDelay).toBe(RATE_LIMIT_CONFIGS.interactive.maxDelay);
      expect(customConfig.backoffMultiplier).toBe(RATE_LIMIT_CONFIGS.interactive.backoffMultiplier);
      expect(customConfig.respectRetryAfter).toBe(RATE_LIMIT_CONFIGS.interactive.respectRetryAfter);
    });

    it('should handle partial overrides', () => {
      const customConfig = createCustomConfig({
        maxRetries: 3
      });

      expect(customConfig.maxRetries).toBe(3);
      expect(customConfig.baseDelay).toBe(RATE_LIMIT_CONFIGS.interactive.baseDelay);
      expect(customConfig.operationType).toBe(RATE_LIMIT_CONFIGS.interactive.operationType);
    });

    it('should handle empty overrides', () => {
      const customConfig = createCustomConfig({});

      expect(customConfig).toEqual(RATE_LIMIT_CONFIGS.interactive);
    });
  });

  // Notion-specific operation type tests will be added during integration phase

  describe('configuration consistency', () => {
    it('should have consistent property types across all configs', () => {
      const configs = [
        RATE_LIMIT_CONFIGS.interactive,
        RATE_LIMIT_CONFIGS.bulk,
        RATE_LIMIT_CONFIGS.critical
      ];

      configs.forEach(config => {
        expect(typeof config.maxRetries).toBe('number');
        expect(typeof config.baseDelay).toBe('number');
        expect(typeof config.maxDelay).toBe('number');
        expect(typeof config.backoffMultiplier).toBe('number');
        expect(typeof config.respectRetryAfter).toBe('boolean');
        expect(typeof config.operationType).toBe('string');
        
        expect(config.maxRetries).toBeGreaterThan(0);
        expect(config.baseDelay).toBeGreaterThan(0);
        expect(config.maxDelay).toBeGreaterThan(config.baseDelay);
        expect(config.backoffMultiplier).toBeGreaterThan(1);
      });
    });

    it('should have logical delay relationships', () => {
      const configs = [
        RATE_LIMIT_CONFIGS.interactive,
        RATE_LIMIT_CONFIGS.bulk,
        RATE_LIMIT_CONFIGS.critical
      ];

      configs.forEach(config => {
        expect(config.maxDelay).toBeGreaterThan(config.baseDelay);
        expect(config.backoffMultiplier).toBeGreaterThan(1);
        expect(config.backoffMultiplier).toBeLessThanOrEqual(3); // Reasonable upper bound
      });
    });
  });
}); 