import { Request, Response, Router } from 'express';
import { refreshReferendas } from '../refresh';
import { processAllPendingTransitions } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { MimirTransaction } from '../database/models/mimirTransaction';

const logger = createSubsystemLogger(Subsystem.REFRESH);
const router = Router();

// Refresh referendas from Polkassembly
router.get('/refresh-referendas', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30; // Default to 30, allow user override
    
    // Start refresh in background (don't await)
    refreshReferendas(limit).catch(error => {
      logger.error({ error: formatError(error), limit }, 'Background refresh failed');
    });
    
    // Return immediately
    res.json({ 
      message: `Referenda refresh started in background with limit ${limit}`,
      timestamp: new Date().toISOString(),
      limit: limit,
      status: "started"
    });
  } catch (error) {
    res.status(500).json({ error: "Error starting refresh: " + (error as any).message });
  }
});

// Process pending status transitions (failsafe)
router.get('/process-pending-transitions', async (req: Request, res: Response) => {
  try {
    logger.info('Processing pending status transitions (manual trigger)');
    
    const result = await processAllPendingTransitions();
    
    res.json({
      message: 'Pending transitions processed successfully',
      timestamp: new Date().toISOString(),
      processed: result.processed,
      transitioned: result.transitioned,
      details: result.details
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, 'Error processing pending transitions');
    res.status(500).json({ 
      error: "Error processing pending transitions: " + (error as any).message 
    });
  }
});

// Clean up stale Mimir transactions
router.get('/cleanup-mimir-transactions', async (req: Request, res: Response) => {
  try {
    const daysParam = req.query.days as string;
    const useTimeFilter = daysParam !== undefined;
    const olderThanDays = parseInt(daysParam) || 0;
    
    logger.info({ olderThanDays, useTimeFilter }, 'Cleaning up stale Mimir transactions (manual trigger)');
    
    let staleCount: number;
    let cleanedUp: number;
    
    if (useTimeFilter && olderThanDays > 0) {
      // Use the time-filtered cleanup
      staleCount = await MimirTransaction.getStaleTransactionCount(olderThanDays);
      cleanedUp = await MimirTransaction.cleanupStaleTransactions(olderThanDays);
    } else {
      // Clean up ALL pending transactions immediately (no time constraint)
      const { db } = await import('../database/connection');
      
      // Get count before cleanup
      const countResult = await db.get('SELECT COUNT(*) as count FROM mimir_transactions WHERE status = ?', ['pending']);
      staleCount = countResult?.count || 0;
      
      // Perform cleanup
      const result = await db.run('UPDATE mimir_transactions SET status = ? WHERE status = ?', ['failed', 'pending']);
      cleanedUp = result.changes || 0;
    }
    
    res.json({
      message: 'Mimir transaction cleanup completed successfully',
      timestamp: new Date().toISOString(),
      mode: useTimeFilter && olderThanDays > 0 ? `older than ${olderThanDays} days` : 'all pending transactions',
      staleTransactionsFound: staleCount,
      transactionsCleaned: cleanedUp
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, 'Error cleaning up Mimir transactions');
    res.status(500).json({ 
      error: "Error cleaning up Mimir transactions: " + (error as any).message 
    });
  }
});

export default router; 