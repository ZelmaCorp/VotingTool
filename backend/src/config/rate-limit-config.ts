import { RateLimitConfig } from '../utils/rate-limit-handler';

/**
 * Rate limiting configurations for different operation types
 */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Quick operations where user is waiting
  interactive: {
    maxRetries: 2,
    baseDelay: 1000, // 1 second
    maxDelay: 5000, // 5 seconds max
    backoffMultiplier: 2,
    respectRetryAfter: true,
    operationType: 'interactive'
  },

  // Background sync operations
  bulk: {
    maxRetries: 5,
    baseDelay: 2000, // 2 seconds
    maxDelay: 30000, // 30 seconds max
    backoffMultiplier: 1.5,
    respectRetryAfter: true,
    operationType: 'bulk'
  },

  // Critical operations that must not fail
  critical: {
    maxRetries: 8,
    baseDelay: 1500, // 1.5 seconds
    maxDelay: 60000, // 1 minute max
    backoffMultiplier: 1.8,
    respectRetryAfter: true,
    operationType: 'critical'
  }
};

/**
 * Get rate limit config for specific operation
 */
export function getRateLimitConfig(operationType: keyof typeof RATE_LIMIT_CONFIGS): RateLimitConfig {
  const config = RATE_LIMIT_CONFIGS[operationType];
  if (!config) {
    console.warn(`Unknown operation type: ${operationType}, using interactive config`);
    return RATE_LIMIT_CONFIGS.interactive;
  }
  return config;
}

/**
 * Create custom rate limit config
 */
export function createCustomConfig(overrides: Partial<RateLimitConfig>): RateLimitConfig {
  const baseConfig = RATE_LIMIT_CONFIGS.interactive;
  return {
    ...baseConfig,
    ...overrides
  };
}

// Notion-specific operation types will be added later during integration phase 