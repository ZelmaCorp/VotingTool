import { Web3AuthRequest, AuthenticatedUser, AuthToken } from "../types/auth";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { Chain } from "../types/properties";
import { DAO } from "../database/models/dao";
import jwt from "jsonwebtoken";
import { signatureVerify } from '@polkadot/util-crypto';

const logger = createSubsystemLogger(Subsystem.APP);

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY_HOURS = 24*7*4; // 4 weeks

/**
 * Verify Web3 signature for authentication
 */
export async function verifyWeb3Signature(authRequest: Web3AuthRequest): Promise<boolean> {
  try {
    const { address, signature, message, timestamp } = authRequest;
    
    // Check if timestamp is not too old (5 minutes)
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      logger.warn({ address, timestamp, now }, "Authentication request expired");
      return false;
    }

    // Validate required fields
    if (!address || !signature || !message) {
      logger.warn({ address }, "Missing required fields for signature verification");
      return false;
    }

    // Basic format validation for Polkadot addresses
    if (!address.startsWith("1") && !address.startsWith("5")) {
      logger.warn({ address }, "Invalid Polkadot address format");
      return false;
    }

    try {
      // Verify signature using @polkadot/util-crypto
      const isValid = signatureVerify(message, signature, address);
      
      if (!isValid.isValid) {
        logger.warn({ address }, "Invalid signature verification");
        return false;
      }
      
      logger.debug({ address }, "Signature verification successful");
      return true;
    } catch (sigError) {
      logger.error({ error: formatError(sigError), address }, "Error during signature verification");
      return false;
    }
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error verifying Web3 signature");
    return false;
  }
}

/**
 * Find multisig member by wallet address using blockchain data
 * Checks all DAOs on both networks to find where the wallet is a member
 */
export async function findTeamMemberByAddress(walletAddress: string): Promise<AuthenticatedUser | null> {
  try {
    // Try both networks since we don't know which one the user is using
    logger.info({ walletAddress }, "Checking wallet address in all DAOs on both networks");
    
    // Check Polkadot first
    let memberDaos = await DAO.findDaosForWallet(walletAddress, Chain.Polkadot);
    let network: "Polkadot" | "Kusama" = "Polkadot";
    
    // If not found in Polkadot, try Kusama
    if (memberDaos.length === 0) {
      logger.info({ walletAddress }, "Not found in Polkadot DAOs, checking Kusama");
      memberDaos = await DAO.findDaosForWallet(walletAddress, Chain.Kusama);
      network = "Kusama";
    }
    
    if (memberDaos.length === 0) {
      logger.warn({ walletAddress }, "Authentication failed - wallet not found in any DAO on either network");
      return null;
    }

    // Use the first DAO found
    const dao = memberDaos[0];
    const multisigAddress = await DAO.getDecryptedMultisig(dao.id, network === "Polkadot" ? Chain.Polkadot : Chain.Kusama);
    
    if (!multisigAddress) {
      logger.warn({ walletAddress, daoId: dao.id, network }, "DAO has no multisig configured for this network");
      return null;
    }

    // Get additional multisig member info
    const memberInfo = await multisigService.getTeamMemberByAddress(walletAddress, multisigAddress, network);
    
    if (memberInfo) {
      logger.info({ 
        walletAddress, 
        daoId: dao.id, 
        daoName: dao.name,
        network 
      }, "User authenticated successfully");
      
      return {
        address: memberInfo.wallet_address,
        name: memberInfo.team_member_name || `${dao.name} Member`,
        network: memberInfo.network
      };
    }

    // Fallback if memberInfo is null
    return {
      address: walletAddress,
      name: `${dao.name} Member`,
      network: network
    };
  } catch (error) {
    logger.error({ error: formatError(error), walletAddress }, "Error finding multisig member by address");
    return null;
  }
}

/**
 * Generate JWT token for authenticated user
 */
export function generateAuthToken(user: AuthenticatedUser): string {
  const payload = {
    address: user.address,  // Use address field
    name: user.name,
    network: user.network,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (JWT_EXPIRY_HOURS * 60 * 60)
  };
  
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

/**
 * Verify JWT token and extract user information
 */
export function verifyAuthToken(token: string): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return {
      address: decoded.address,  // Use address field
      name: decoded.name,
      network: decoded.network
    };
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error verifying auth token");
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  return authHeader.substring(7); // Remove "Bearer " prefix
} 