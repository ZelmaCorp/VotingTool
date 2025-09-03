import { Request, Response, NextFunction } from "express";
import { verifyAuthToken, extractTokenFromHeader } from "../utils/auth";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.APP);

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated: boolean;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and adds user to request object
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      req.isAuthenticated = false;
      return next();
    }
    
    const user = verifyAuthToken(token);
    if (user) {
      req.user = user;
      req.isAuthenticated = true;
      logger.debug({ address: user.address }, "User authenticated");
    } else {
      req.isAuthenticated = false;
      logger.warn("Invalid authentication token");
    }
    
    next();
  } catch (error) {
    logger.error({ error }, "Error in authentication middleware");
    req.isAuthenticated = false;
    next();
  }
}

/**
 * Require authentication middleware
 * Returns 401 if user is not authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void | Response {
  if (!req.isAuthenticated || !req.user) {
    logger.warn({ path: req.path }, "Unauthorized access attempt");
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }
  
  next();
}

/**
 * Require multisig member middleware
 * Ensures user is a registered multisig member
 */
export function requireTeamMember(req: Request, res: Response, next: NextFunction): void | Response {
  if (!req.isAuthenticated || !req.user) {
    logger.warn({ path: req.path }, "Unauthorized access attempt");
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }
  
  // Check if user has a valid wallet address
  if (!req.user.address) {
    logger.warn({ address: req.user.address }, "User wallet address not found");
    return res.status(403).json({
      success: false,
      error: "Access denied: Invalid user data"
    });
  }
  
  next();
}

/**
 * Optional authentication middleware
 * Adds user to request if token is valid, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  authenticateToken(req, res, next);
} 