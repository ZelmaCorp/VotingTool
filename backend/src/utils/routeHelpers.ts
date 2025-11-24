import { Response } from 'express';
import { Referendum } from '../database/models/referendum';
import { Chain } from '../types/properties';

/**
 * Common route helper utilities
 * Standardized validation and error responses
 */

/**
 * Standard error response format
 */
export function errorResponse(res: Response, status: number, error: string) {
  return res.status(status).json({ success: false, error });
}

/**
 * Standard success response format
 */
export function successResponse(res: Response, data: any = {}) {
  return res.json({ success: true, ...data });
}

/**
 * Validate user authentication
 */
export function validateUser(userAddress: string | undefined, res: Response): boolean {
  if (!userAddress) {
    errorResponse(res, 400, "User wallet address not found");
    return false;
  }
  return true;
}

/**
 * Validate chain parameter
 */
export function validateChain(chain: any, res: Response): boolean {
  if (!chain) {
    errorResponse(res, 400, "Chain parameter is required");
    return false;
  }
  return true;
}

/**
 * Find referendum by postId and chain with standardized error handling
 */
export async function findReferendum(
  postId: number, 
  chain: Chain, 
  res: Response,
  daoId?: number
): Promise<any | null> {
  // If daoId is not provided, we can't reliably find the referendum in a multi-DAO setup
  // Try to find it by iterating through all DAOs (not optimal, but backward compatible)
  let referendum: any = null;
  
  if (daoId) {
    referendum = await Referendum.findByPostIdAndChain(postId, chain, daoId);
  } else {
    // Get all referendums and find the one matching postId and chain
    const allRefs = await Referendum.getAll();
    referendum = allRefs.find(r => r.post_id === postId && r.chain === chain);
  }
  
  if (!referendum || !referendum.id) {
    errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    return null;
  }
  
  return referendum;
}

/**
 * Validate and parse postId parameter
 */
export function validatePostId(postId: string, res: Response): number | null {
  const parsed = parseInt(postId);
  
  if (isNaN(parsed)) {
    errorResponse(res, 400, "Invalid post ID");
    return null;
  }
  
  return parsed;
}

