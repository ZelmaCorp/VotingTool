import { Request, Response, Router } from 'express';
import { sendReadyProposalsToMimir } from '../mimir/refreshEndpoint';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.MIMIR);
const router = Router();

// Send ready proposals to Mimir
router.get("/send-to-mimir", async (req: Request, res: Response) => {
  try {
    await sendReadyProposalsToMimir();
    res.json({ 
      success: true,
      message: "Successfully sent referendas to Mimir",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error sending referendas to Mimir");
    res.status(500).json({ 
      success: false,
      error: "Error sending referendas to Mimir: " + (error as any).message 
    });
  }
});

export default router; 