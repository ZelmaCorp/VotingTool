import { Request, Response, Router } from 'express';

const router = Router();

// Health check endpoint
router.get("/", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router; 