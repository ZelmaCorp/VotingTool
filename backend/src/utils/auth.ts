import { Web3AuthRequest, AuthenticatedUser, AuthToken } from "../types/auth";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";
import crypto from "crypto";

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

    // For now, we'll do basic validation
    // In production, you should implement proper signature verification using @polkadot/util-crypto
    if (!address || !signature || !message) {
      return false;
    }

    // Basic format validation for Polkadot addresses
    if (!address.startsWith("1") && !address.startsWith("5")) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error({ error }, "Error verifying Web3 signature");
    return false;
  }
}

/**
 * Find multisig member by wallet address using blockchain data
 */
export async function findTeamMemberByAddress(walletAddress: string): Promise<AuthenticatedUser | null> {
  try {
    // Check if the wallet address is a multisig member using blockchain data
    const isMember = await multisigService.isTeamMember(walletAddress);
    
    if (!isMember) {
      logger.debug({ walletAddress }, "Wallet address not found in multisig members");
      return null;
    }

    // Get additional multisig member info
    const memberInfo = await multisigService.getTeamMemberByAddress(walletAddress);
    
    if (memberInfo) {
      return {
        id: 0, // We don't have database IDs anymore, use 0 as placeholder
        name: memberInfo.name || `Multisig Member (${memberInfo.network})`,
        email: undefined, // No email from blockchain data
        wallet_address: memberInfo.address,
        network: memberInfo.network
      };
    }

    // Fallback if memberInfo is null
    return {
      id: 0,
      name: "Multisig Member",
      email: undefined,
      wallet_address: walletAddress,
      network: "Unknown"
    };
  } catch (error) {
    logger.error({ error, walletAddress }, "Error finding multisig member by address");
    return null;
  }
}

/**
 * Generate JWT token for authenticated user
 */
export function generateAuthToken(user: AuthenticatedUser): string {
  const payload = {
    userId: user.id,
    address: user.wallet_address,
    name: user.name,
    network: user.network,
    exp: Math.floor(Date.now() / 1000) + (JWT_EXPIRY_HOURS * 60 * 60)
  };
  
  // Simple token generation - in production, use a proper JWT library
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto.createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payloadEncoded}`)
    .digest("base64");
  
  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * Verify JWT token and extract user information
 */
export function verifyAuthToken(token: string): AuthenticatedUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    
    const [header, payload, signature] = parts;
    
    // Verify signature
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payloadData = JSON.parse(Buffer.from(payload, "base64").toString());
    
    // Check expiration
    if (payloadData.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      id: payloadData.userId,
      name: payloadData.name,
      wallet_address: payloadData.address,
      network: payloadData.network
    };
  } catch (error) {
    logger.error({ error }, "Error verifying auth token");
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