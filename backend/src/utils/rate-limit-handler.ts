export interface RateLimitConfig {
  maxRetries: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  respectRetryAfter: boolean;
  operationType: 'interactive' | 'bulk' | 'critical';
}

export interface RetryContext {
  attempt: number;
  lastError?: Error;
  totalElapsed: number;
  operationType: string;
}

export interface DeadLetterOperation {
  id: string;
  operationType: string;
  error: string;
  context: RetryContext;
  failedAt: Date;
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    public readonly context?: RetryContext
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class RateLimitHandler {
  private static instance: RateLimitHandler;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private deadLetterQueue: Map<string, DeadLetterOperation> = new Map();

  static getInstance(): RateLimitHandler {
    if (!RateLimitHandler.instance) {
      RateLimitHandler.instance = new RateLimitHandler();
    }
    return RateLimitHandler.instance;
  }

  /**
   * Execute a function with rate limiting protection
   */
  async executeWithRateLimit<T>(
    operation: () => Promise<T>,
    config: RateLimitConfig,
    operationId?: string
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        const result = await operation();
        
        // Log successful operation
        if (attempt > 1) {
          console.log(`✅ Operation succeeded after ${attempt} attempts (${config.operationType})`);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        const isRateLimit = this.isRateLimitError(error);
        
        if (!isRateLimit || attempt > config.maxRetries) {
          // Not a rate limit error or max retries exceeded
          const context = {
            attempt,
            lastError,
            totalElapsed: Date.now() - startTime,
            operationType: config.operationType
          };
          
          // Add to dead letter queue if rate limit exhaustion
          if (isRateLimit && attempt > config.maxRetries && operationId) {
            this.addToDeadLetter(operationId, error as Error, context);
          }
          
          throw this.createDetailedError(error, context);
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(error, attempt, config);
        
        console.log(`⏳ Rate limited (${config.operationType}), retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
        
        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Unknown error in rate limit handler');
  }

  /**
   * Deduplicate identical operations to prevent thundering herd
   */
  async executeWithDeduplication<T>(
    operation: () => Promise<T>,
    config: RateLimitConfig,
    operationKey: string
  ): Promise<T> {
    // Check if same operation is already running
    if (this.requestQueue.has(operationKey)) {
      console.log(`🔄 Deduplicating operation: ${operationKey}`);
      return await this.requestQueue.get(operationKey)!;
    }

    // Execute with rate limiting
    const promise = this.executeWithRateLimit(operation, config, operationKey);
    
    // Store in queue
    this.requestQueue.set(operationKey, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up
      this.requestQueue.delete(operationKey);
    }
  }

  private isRateLimitError(error: any): boolean {
    if (!error) return false;
    
    // Check for Notion API rate limit (429)
    if (error.status === 429 || error.code === 429) return true;
    
    // Check for rate limit in error message
    const message = error.message?.toLowerCase() || '';
    return message.includes('rate limit') || 
           message.includes('too many requests') ||
           message.includes('429');
  }

  private calculateDelay(error: any, attempt: number, config: RateLimitConfig): number {
    // Respect Retry-After header if present
    if (config.respectRetryAfter && error.headers?.['retry-after']) {
      const retryAfter = parseInt(error.headers['retry-after'], 10);
      if (retryAfter && retryAfter > 0) {
        return Math.min(retryAfter * 1000, config.maxDelay);
      }
    }

    // Exponential backoff with jitter
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    const delay = Math.min(exponentialDelay + jitter, config.maxDelay);
    
    return Math.floor(delay);
  }

  private createDetailedError(originalError: any, context: RetryContext): Error {
    if (this.isRateLimitError(originalError)) {
      return new RateLimitError(
        `Rate limit exceeded after ${context.attempt} attempts over ${context.totalElapsed}ms for ${context.operationType} operation`,
        originalError.headers?.['retry-after'],
        context
      );
    }
    
    // Return original error for non-rate-limit issues
    return originalError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status for monitoring
   */
  getQueueStatus(): { active: number; operations: string[] } {
    return {
      active: this.requestQueue.size,
      operations: Array.from(this.requestQueue.keys())
    };
  }

  /**
   * Add operation to dead letter queue when all retries are exhausted
   */
  private addToDeadLetter(operationId: string, error: Error, context: RetryContext): void {
    const deadLetterOp: DeadLetterOperation = {
      id: operationId,
      operationType: context.operationType,
      error: error.message,
      context,
      failedAt: new Date()
    };
    
    this.deadLetterQueue.set(operationId, deadLetterOp);
    console.error(`💀 Operation ${operationId} moved to dead letter queue after ${context.attempt} attempts`);
  }

  /**
   * Get all dead letter operations
   */
  getDeadLetters(): DeadLetterOperation[] {
    return Array.from(this.deadLetterQueue.values());
  }

  /**
   * Get dead letter statistics
   */
  getDeadLetterStats(): { count: number; oldest?: Date; newest?: Date } {
    const deadLetters = this.getDeadLetters();
    if (deadLetters.length === 0) {
      return { count: 0 };
    }

    const dates = deadLetters.map(op => op.failedAt);
    return {
      count: deadLetters.length,
      oldest: new Date(Math.min(...dates.map(d => d.getTime()))),
      newest: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }

  /**
   * Clear dead letter queue
   */
  clearDeadLetters(): number {
    const count = this.deadLetterQueue.size;
    this.deadLetterQueue.clear();
    console.log(`🧹 Cleared ${count} dead letter operations`);
    return count;
  }

  /**
   * Remove specific dead letter operation
   */
  removeDeadLetter(operationId: string): boolean {
    const removed = this.deadLetterQueue.delete(operationId);
    if (removed) {
      console.log(`🗑️ Removed dead letter operation: ${operationId}`);
    }
    return removed;
  }
} 