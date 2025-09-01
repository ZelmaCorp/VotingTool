export enum Subsystem {
  // Core application
  APP = 'app',
  REFRESH = 'refresh',
  
  // External integrations  
  POLKASSEMBLY = 'polkassembly',
  MIMIR = 'mimir',
  COINGECKO = 'coingecko',
  SUBSCAN = 'subscan',
  
  // Infrastructure
  RATE_LIMIT = 'rate-limit',
  UTILS = 'utils',
}

export enum ErrorType {
  // Critical calculation errors
  UNKNOWN_REWARD_FORMAT = 'unknownRewardFormat',
  MALFORMED_AMOUNT = 'malformedAmount',
  
  // API/Network errors  
  TIMEOUT = 'timeout',
  RATE_LIMITED = 'rateLimited',
  INVALID_RESPONSE = 'invalidResponse',
  
  // Business logic errors
  PAGE_NOT_FOUND = 'pageNotFound',
  MISSING_VOTE = 'missingVote',
  DEAD_LETTER = 'deadLetter',
} 