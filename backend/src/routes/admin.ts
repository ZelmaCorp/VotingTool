import { Request, Response, Router } from 'express';
import { refreshReferendas } from '../refresh';
import { processAllPendingTransitions } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';

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

export default router; 