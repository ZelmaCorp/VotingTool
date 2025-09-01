import { Express } from 'express';
import healthRoutes from './health';
import referendumRoutes from './referendums';
import mimirRoutes from './mimir';
import adminRoutes from './admin';

/**
 * Configure all application routes
 * @param app Express application instance
 */
export function configureRoutes(app: Express): void {
  // Health check endpoint
  app.use("/health", healthRoutes);
  
  // Referendum management endpoints
  app.use("/referendums", referendumRoutes);
  
  // Mimir integration endpoints
  app.use("/", mimirRoutes);
  
  // Administrative endpoints
  app.use("/", adminRoutes);
}

// Also export individual route modules for flexibility
export {
  healthRoutes,
  referendumRoutes,
  mimirRoutes,
  adminRoutes
}; 