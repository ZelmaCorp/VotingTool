import { Request, Response, Router } from 'express';
import { refreshReferendas } from '../refresh';
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

export default router; 