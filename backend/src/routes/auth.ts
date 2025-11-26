import { Router, Request, Response } from "express";
import { verifyWeb3Signature, findTeamMemberByAddress, generateAuthToken } from "../utils/auth";
import { Web3AuthRequest, AuthenticatedUser } from "../types/auth";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { requireAuth } from "../middleware/auth";

const router = Router();
const logger = createSubsystemLogger(Subsystem.APP);

/**
 * POST /auth/web3-login
 * Authenticate user with Web3 wallet signature
 */
router.post("/web3-login", async (req: Request, res: Response) => {
  try {
    const { address, signature, message, timestamp }: Web3AuthRequest = req.body;
    
    // Validate required fields
    if (!address || !signature || !message || !timestamp) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: address, signature, message, timestamp"
      });
    }
    
    // Verify Web3 signature
    const isValidSignature = await verifyWeb3Signature({ address, signature, message, timestamp });
    if (!isValidSignature) {
      logger.warn({ address }, "Invalid Web3 signature");
      return res.status(401).json({
        success: false,
        error: "Invalid signature"
      });
    }
    
    // Try to find multisig member by wallet address
    const teamMember = await findTeamMemberByAddress(address);
    
    // Generate authentication token
    // Allow authentication even if not in a DAO yet (for registration)
    // DAO membership will be checked by requireDaoMembership middleware on protected endpoints
    const userForToken: AuthenticatedUser = teamMember || { 
      address, 
      name: 'Unregistered User',
      network: 'Polkadot' 
    };
    
    const token = generateAuthToken(userForToken);
    
    logger.info({ 
      address, 
      isRegistered: !!teamMember 
    }, teamMember ? "User authenticated successfully" : "Unregistered user authenticated (can register DAO)");
    
    res.json({
      success: true,
      token,
      user: {
        address: userForToken.address,
        name: userForToken.name,
        network: userForToken.network
      }
    });
    
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error in Web3 login");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /auth/logout
 * Logout user (client should discard token)
 */
router.post("/logout", requireAuth, (req: Request, res: Response) => {
  try {
    logger.info({ address: req.user?.address }, "User logged out");
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error in logout");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /auth/profile
 * Get current user profile
 */
router.get("/profile", requireAuth, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated"
      });
    }
    
    res.json({
      success: true,
      user: {
        address: req.user.address,
        name: req.user.name,
        network: req.user.network
      }
    });
    
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error getting user profile");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /auth/verify
 * Verify if current token is valid
 */
router.get("/verify", requireAuth, (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      valid: true,
      user: {
        address: req.user?.address,
        name: req.user?.name,
        network: req.user?.network
      }
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error verifying token");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

export default router; 