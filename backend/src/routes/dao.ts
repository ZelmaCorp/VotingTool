import { Router, Request, Response } from 'express';
import { db } from '../database/connection';
import { authenticateToken } from '../middleware/auth';
import { multisigService } from '../services/multisig';
import { ReferendumAction, InternalStatus } from '../types';
import fs from 'fs';
import path from 'path';

const router = Router();

// Load SQL queries
const commonQueriesPath = path.join(__dirname, '../../database/queries/common_queries.sql');
const commonQueries = fs.readFileSync(commonQueriesPath, 'utf8');

// Split queries into individual statements
const queries = commonQueries.split(';').map(q => q.trim()).filter(q => q);

// Extract individual queries
const [
  NEEDS_AGREEMENT_QUERY,
  READY_TO_VOTE_QUERY,
  FOR_DISCUSSION_QUERY,
  NO_WAYED_QUERY,
  MY_ASSIGNMENTS_QUERY,
  ACTIONS_NEEDED_QUERY,
  MY_EVALUATIONS_QUERY
] = queries;

/**
 * GET /dao/workflow
 * Get all workflow data in a single request
 */
router.get("/workflow", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get team members from multisig service for counting
    const teamMembers = await multisigService.getCachedTeamMembers();
    const requiredAgreements = teamMembers.length > 0 ? Math.ceil(teamMembers.length / 2) : 4;

    // Get proposals waiting for agreement
    const needsAgreement = await db.all(NEEDS_AGREEMENT_QUERY, [
      requiredAgreements,
      requiredAgreements
    ]);

    // Get proposals ready to vote
    const readyToVote = await db.all(READY_TO_VOTE_QUERY);

    // Get proposals for discussion
    const forDiscussion = await db.all(FOR_DISCUSSION_QUERY);

    // Get vetoed proposals
    const vetoedProposals = await db.all(NO_WAYED_QUERY);

    res.json({
      success: true,
      data: {
        needsAgreement,
        readyToVote,
        forDiscussion,
        vetoedProposals
      }
    });

  } catch (error) {
    console.error('Failed to get workflow data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workflow data'
    });
  }
});

/**
 * GET /dao/my-assignments
 * Get user's assigned proposals
 */
router.get("/my-assignments", authenticateToken, async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user?.address;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access attempt"
      });
    }

    // Get user's assignments
    const assignments = await db.all(MY_ASSIGNMENTS_QUERY, [walletAddress]);

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Failed to get user assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user assignments'
    });
  }
});

/**
 * GET /dao/actions-needed
 * Get proposals needing action from the user
 */
router.get("/actions-needed", authenticateToken, async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user?.address;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access attempt"
      });
    }

    // Get proposals needing action
    const actionsNeeded = await db.all(ACTIONS_NEEDED_QUERY, [
      walletAddress, // For agree check
      walletAddress  // For discussion check
    ]);

    res.json({
      success: true,
      data: actionsNeeded
    });

  } catch (error) {
    console.error('Failed to get actions needed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get actions needed'
    });
  }
});

/**
 * GET /dao/my-evaluations
 * Get proposals evaluated by the user
 */
router.get("/my-evaluations", authenticateToken, async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user?.address;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access attempt"
      });
    }

    // Get user's evaluations
    const evaluations = await db.all(MY_EVALUATIONS_QUERY, [walletAddress]);

    res.json({
      success: true,
      data: evaluations
    });

  } catch (error) {
    console.error('Failed to get user evaluations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user evaluations'
    });
  }
});

export default router;