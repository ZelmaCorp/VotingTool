import { Web3AuthRequest, AuthenticatedUser, AuthToken } from "../types/auth";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
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
 */
export async function findTeamMemberByAddress(walletAddress: string): Promise<AuthenticatedUser | null> {
  try {
    // Try both networks since we don't know which one the user is using
    logger.info({ walletAddress }, "Checking wallet address in both networks");
    
    // Check Polkadot first
    let isMember = await multisigService.isTeamMember(walletAddress, "Polkadot");
    let network = "Polkadot" as "Polkadot" | "Kusama";
    
    // If not found in Polkadot, try Kusama
    if (!isMember) {
      logger.info({ walletAddress }, "Not found in Polkadot, checking Kusama");
      isMember = await multisigService.isTeamMember(walletAddress, "Kusama");
      if (isMember) {
        network = "Kusama";
      }
    }
    
    if (!isMember) {
      logger.debug({ walletAddress }, "Wallet address not found in multisig members on either network");
      
      // Get the configured multisig addresses for better error context
      const polkadotMultisig = process.env.POLKADOT_MULTISIG;
      const kusamaMultisig = process.env.KUSAMA_MULTISIG;
      
      logger.warn({ 
        walletAddress, 
        polkadotMultisig, 
        kusamaMultisig 
      }, "Authentication failed - address not in configured multisigs");
      
      return null;
    }

    // Get additional multisig member info
    const memberInfo = await multisigService.getTeamMemberByAddress(walletAddress, network);
    
    if (memberInfo) {
      return {
        address: memberInfo.wallet_address,  // Use address field
        name: memberInfo.team_member_name || `Multisig Member (${memberInfo.network})`,
        network: memberInfo.network
      };
    }

    // Fallback if memberInfo is null
    return {
      address: walletAddress,  // Use address field
      name: "Multisig Member",
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