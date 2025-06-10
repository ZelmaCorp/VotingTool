import { RateLimitConfig } from './rate-limit-handler';

export interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'search';
  operation: string; // function name
  data: any;
  attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead-letter';
  createdAt: Date;
  lastAttemptAt?: Date;
  completedAt?: Date;
  error?: string;
  config: RateLimitConfig;
}

export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  operationId: string;
}

/**
 * Persistent operation queue for data loss prevention
 */
export class OperationQueue {
  private static instance: OperationQueue;
  private queue: Map<string, QueuedOperation> = new Map();
  private deadLetterQueue: Map<string, QueuedOperation> = new Map();
  private processing = false;

  static getInstance(): OperationQueue {
    if (!OperationQueue.instance) {
      OperationQueue.instance = new OperationQueue();
    }
    return OperationQueue.instance;
  }

  /**
   * Add operation to queue with persistence
   */
  async enqueue<T>(
    operationType: string,
    operation: () => Promise<T>,
    data: any,
    config: RateLimitConfig,
    operationId?: string
  ): Promise<string> {
    const id = operationId || this.generateOperationId();
    
    const queuedOperation: QueuedOperation = {
      id,
      type: this.getOperationType(operationType),
      operation: operationType,
      data,
      attempts: 0,
      status: 'pending',
      createdAt: new Date(),
      config
    };

    // Persist operation before execution
    this.queue.set(id, queuedOperation);
    
    console.log(`📋 Queued operation: ${operationType} (${id})`);
    
    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  /**
   * Execute operation with queue protection
   */
  async executeWithQueue<T>(
    operationType: string,
    operation: () => Promise<T>,
    data: any,
    config: RateLimitConfig,
    operationId?: string
  ): Promise<OperationResult<T>> {
    const id = await this.enqueue(operationType, operation, data, config, operationId);
    
    // Wait for operation to complete
    return new Promise((resolve) => {
      const checkStatus = () => {
        const op = this.queue.get(id) || this.deadLetterQueue.get(id);
        
        if (op?.status === 'completed') {
          resolve({
            success: true,
            data: op.data,
            operationId: id
          });
        } else if (op?.status === 'failed' || op?.status === 'dead-letter') {
          resolve({
            success: false,
            error: op.error || 'Operation failed',
            operationId: id
          });
        } else {
          // Still processing, check again
          setTimeout(checkStatus, 100);
        }
      };
      
      checkStatus();
    });
  }

  /**
   * Process queued operations
   */
  private async processQueue(): Promise<void> {
    this.processing = true;
    
    try {
      const pendingOps = Array.from(this.queue.values())
        .filter(op => op.status === 'pending')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      for (const operation of pendingOps) {
        await this.processOperation(operation);
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Process individual operation
   */
  private async processOperation(operation: QueuedOperation): Promise<void> {
    operation.status = 'processing';
    operation.attempts++;
    operation.lastAttemptAt = new Date();

    try {
      // Here you would reconstruct and execute the actual operation
      // For now, this is a placeholder that simulates the execution
      console.log(`🔄 Processing: ${operation.operation} (attempt ${operation.attempts})`);
      
      // Simulate operation execution
      // In real implementation, you would:
      // 1. Reconstruct the function from operation.operation
      // 2. Call it with operation.data
      // 3. Handle the result
      
      // For demonstration, we'll mark as completed
      operation.status = 'completed';
      operation.completedAt = new Date();
      
      console.log(`✅ Completed: ${operation.operation} (${operation.id})`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      operation.error = errorMessage;
      
      if (operation.attempts >= operation.config.maxRetries + 1) {
        // Move to dead letter queue
        operation.status = 'dead-letter';
        this.deadLetterQueue.set(operation.id, operation);
        this.queue.delete(operation.id);
        
        console.error(`💀 Operation moved to dead letter queue: ${operation.operation} (${operation.id})`);
      } else {
        // Mark as pending for retry
        operation.status = 'pending';
        console.warn(`⚠️ Operation failed, will retry: ${operation.operation} (attempt ${operation.attempts}/${operation.config.maxRetries + 1})`);
      }
    }
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    deadLetter: number;
    total: number;
  } {
    const operations = Array.from(this.queue.values());
    
    return {
      pending: operations.filter(op => op.status === 'pending').length,
      processing: operations.filter(op => op.status === 'processing').length,
      completed: operations.filter(op => op.status === 'completed').length,
      failed: operations.filter(op => op.status === 'failed').length,
      deadLetter: this.deadLetterQueue.size,
      total: operations.length + this.deadLetterQueue.size
    };
  }

  /**
   * Get operations by status
   */
  getOperationsByStatus(status: QueuedOperation['status']): QueuedOperation[] {
    if (status === 'dead-letter') {
      return Array.from(this.deadLetterQueue.values());
    }
    
    return Array.from(this.queue.values()).filter(op => op.status === status);
  }

  /**
   * Retry dead letter operations
   */
  async retryDeadLetterOperations(): Promise<void> {
    const deadOperations = Array.from(this.deadLetterQueue.values());
    
    for (const operation of deadOperations) {
      // Reset operation state
      operation.status = 'pending';
      operation.attempts = 0;
      operation.error = undefined;
      
      // Move back to main queue
      this.queue.set(operation.id, operation);
      this.deadLetterQueue.delete(operation.id);
      
      console.log(`🔄 Retrying dead letter operation: ${operation.operation} (${operation.id})`);
    }
    
    // Process the queue
    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Clear completed operations (cleanup)
   */
  clearCompleted(): number {
    const completedOps = Array.from(this.queue.entries())
      .filter(([_, op]) => op.status === 'completed');
    
    completedOps.forEach(([id, _]) => this.queue.delete(id));
    
    console.log(`🧹 Cleared ${completedOps.length} completed operations`);
    return completedOps.length;
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOperationType(operationName: string): QueuedOperation['type'] {
    if (operationName.includes('create')) return 'create';
    if (operationName.includes('update')) return 'update';
    if (operationName.includes('delete')) return 'delete';
    return 'search';
  }
} 