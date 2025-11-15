import { Request, Response, NextFunction } from "express";
import { verifyAuthToken, extractTokenFromHeader } from "../utils/auth";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { DAO } from "../database/models/dao";
import { Chain } from "../types/properties";

const logger = createSubsystemLogger(Subsystem.APP);

// Extend Express Request interface to include user and DAO context
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated: boolean;
      daoId?: number;
      daoIds?: number[]; // All DAOs the user is a member of
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
    logger.error({ error: formatError(error) }, "Error in authentication middleware");
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

/**
 * Add DAO context middleware
 * Finds which DAO(s) the authenticated user belongs to
 * Sets req.daoId (primary) and req.daoIds (all)
 * 
 * Frontend can optionally pass multisig address via:
 * - Query parameter: ?multisig=15oF4uVJwmo...
 * - Header: X-Multisig-Address: 15oF4uVJwmo...
 * 
 * If multisig is provided, it will be used to identify the DAO directly.
 * Otherwise, finds all DAOs the wallet belongs to.
 */
export async function addDaoContext(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.isAuthenticated || !req.user || !req.user.address) {
      return next();
    }

    const walletAddress = req.user.address;
    const network = req.user.network as "Polkadot" | "Kusama" || "Polkadot";
    const chain = network === "Polkadot" ? Chain.Polkadot : Chain.Kusama;

    // Check if frontend provided a specific multisig address
    const multisigAddress = (req.query.multisig as string) || req.headers['x-multisig-address'] as string;

    if (multisigAddress) {
      // Frontend specified a multisig - find the DAO by multisig address
      const dao = await DAO.findByMultisig(multisigAddress, chain);
      
      if (dao) {
        // Verify user is actually a member of this DAO's multisig
        const isMember = await DAO.isValidMember(dao.id, walletAddress, chain);
        
        if (isMember) {
          req.daoId = dao.id;
          req.daoIds = [dao.id];
          
          logger.debug({ 
            address: walletAddress,
            multisigAddress,
            daoId: dao.id,
            daoName: dao.name
          }, "DAO context set from multisig address");
        } else {
          logger.warn({ 
            address: walletAddress,
            multisigAddress,
            daoId: dao.id
          }, "User not a member of specified multisig");
        }
      } else {
        logger.warn({ multisigAddress, chain }, "No DAO found for provided multisig address");
      }
    } else {
      // No multisig specified - find all DAOs this wallet is a member of
      const memberDaos = await DAO.findDaosForWallet(walletAddress, chain);

      if (memberDaos.length > 0) {
        req.daoIds = memberDaos.map(dao => dao.id);
        req.daoId = memberDaos[0].id; // Primary DAO (first one)
        
        logger.debug({ 
          address: walletAddress, 
          daoId: req.daoId,
          totalDaos: memberDaos.length 
        }, "DAO context added to request");
      } else {
        logger.warn({ address: walletAddress, network }, "User wallet not found in any DAO multisig");
      }
    }

    next();
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error adding DAO context");
    next(); // Continue without DAO context rather than failing
  }
}

/**
 * Require DAO membership middleware
 * Ensures user belongs to at least one DAO
 */
export function requireDaoMembership(req: Request, res: Response, next: NextFunction): void | Response {
  if (!req.isAuthenticated || !req.user) {
    logger.warn({ path: req.path }, "Unauthorized access attempt");
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  if (!req.daoId || !req.daoIds || req.daoIds.length === 0) {
    logger.warn({ 
      address: req.user.address,
      path: req.path 
    }, "User not a member of any DAO");
    return res.status(403).json({
      success: false,
      error: "Access denied: You are not a member of any DAO. Please contact an administrator."
    });
  }

  next();
} 