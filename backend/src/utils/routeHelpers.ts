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
  res: Response
): Promise<any | null> {
  const referendum = await Referendum.findByPostIdAndChain(postId, chain);
  
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

