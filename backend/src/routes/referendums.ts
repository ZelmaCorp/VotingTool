import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { Chain, InternalStatus } from '../types/properties';
import { isValidTransition, getNextStatus, canManuallySetStatus, getTransitionErrorMessage } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';
import { requireTeamMember } from '../middleware/auth';
import { multisigService } from '../services/multisig';

const logger = createSubsystemLogger(Subsystem.APP);
const router = Router();

// Get all referendums from the database
router.get("/", async (req: Request, res: Response) => {
  try {
    const referendums = await Referendum.getAll();
    res.json({
      success: true,
      referendums
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching referendums from database");
    res.status(500).json({ 
      success: false,
      error: "Error fetching referendums: " + formatError(error)
    });
  }
});

// Get a specific referendum by post_id and chain
router.get("/:postId", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid post ID" 
      });
    }

    // Validate chain
    if (!chain || !Object.values(Chain).includes(chain)) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'" 
      });
    }

    // Find the referendum
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    
    if (!referendum) {
      return res.status(404).json({ 
        success: false, 
        error: `Referendum ${postId} not found on ${chain} network` 
      });
    }

    res.json({ 
      success: true, 
      referendum 
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching referendum from database");
    res.status(500).json({ 
      success: false, 
      error: "Error fetching referendum: " + formatError(error)
    });
  }
});

// Update a specific referendum by post_id and chain
router.put("/:postId/:chain", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.params.chain as Chain;
    const updates = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Validate chain
    if (!Object.values(Chain).includes(chain)) {
      return res.status(400).json({ error: "Invalid chain. Must be 'Polkadot' or 'Kusama'" });
    }

    // First, get the referendum to get its database ID
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({ error: "Referendum not found" });
    }

    // Separate referendum fields from voting decision fields
    const referendumFields: any = {};
    const votingFields: any = {};

    // Fields that go to the referendums table
    const referendumColumns = [
      'title', 'description', 'requested_amount_usd', 'origin', 'referendum_timeline',
      'internal_status', 'link', 'voting_start_date', 'voting_end_date',
      'last_edited_by', 'public_comment', 'public_comment_made', 'ai_summary',
      'reason_for_vote', 'reason_for_no_way', 'voted_link'
    ];

    // Fields that go to the voting_decisions table
    const votingColumns = ['suggested_vote', 'final_vote', 'vote_executed', 'vote_executed_date'];

    // Separate the fields
    Object.keys(updates).forEach(key => {
      if (referendumColumns.includes(key)) {
        referendumFields[key] = updates[key];
      } else if (votingColumns.includes(key)) {
        votingFields[key] = updates[key];
      }
    });

    // Update referendum fields if any
    if (Object.keys(referendumFields).length > 0) {
      // Check if status is being updated
      if (referendumFields.internal_status) {
        const newStatus = referendumFields.internal_status as InternalStatus;

        // Check if user is assigned to this referendum
        const isAssigned = await db.get(
          "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
          [referendum.id, req.user?.address, ReferendumAction.RESPONSIBLE_PERSON]
        );

        // Only assigned user can change status (except for special statuses)
        if (!isAssigned && !canManuallySetStatus(newStatus)) {
          return res.status(403).json({
            success: false,
            error: "Only the assigned user can change the status"
          });
        }

        // Validate status transition
        const currentStatus = referendum.internal_status as InternalStatus;
        if (!isValidTransition(currentStatus, newStatus)) {
          return res.status(400).json({
            success: false,
            error: getTransitionErrorMessage(currentStatus, newStatus)
          });
        }
      }

      await Referendum.update(postId, chain, referendumFields);
    }

    // Update voting decision fields if any
    if (Object.keys(votingFields).length > 0) {
      await VotingDecision.upsert(referendum.id!, votingFields);
      
      // If suggested_vote is being updated, handle automatic transitions and updates
      if (votingFields.suggested_vote && req.user?.address) {
        try {
          // Check if user is assigned as responsible person for this referendum
          const existingAssignment = await db.get(
            "SELECT role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
            [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
          );
          
          if (!existingAssignment) {
            return res.status(403).json({
              success: false,
              error: "Only the assigned responsible person can set a suggested vote"
            });
          }

          // Start a transaction for all the changes
          await db.run('BEGIN TRANSACTION');

          try {
            // If we're in Considering status, auto-transition to ReadyForApproval
            if (referendum.internal_status === InternalStatus.Considering) {
              await db.run(
                "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
                [InternalStatus.ReadyForApproval, referendum.id]
              );
              
              logger.info({
                referendumId: referendum.id,
                postId: referendum.post_id,
                chain: referendum.chain,
                oldStatus: InternalStatus.Considering,
                newStatus: InternalStatus.ReadyForApproval,
                suggestedVote: votingFields.suggested_vote
              }, "Auto-transitioned to Ready for approval after setting suggested vote");
            }

            // Get all current action states for this user
            const existingActions = await db.all(
              "SELECT id, role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
              [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
            );

            // Delete all existing action states (but keep RESPONSIBLE_PERSON)
            for (const action of existingActions) {
              await db.run(
                "DELETE FROM referendum_team_roles WHERE id = ?",
                [action.id]
              );
            }

            // Add AGREE action for the responsible person
            await db.run(
              "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type, created_at) VALUES (?, ?, ?, datetime('now'))",
              [referendum.id, req.user.address, ReferendumAction.AGREE]
            );

            await db.run('COMMIT');
          } catch (error) {
            await db.run('ROLLBACK');
            throw error;
          }
        } catch (error) {
          logger.error({
            error: formatError(error),
            referendumId: referendum.id,
            userId: req.user?.address,
            step: 'suggested_vote_update'
          }, "Error updating suggested vote and status");
          
          return res.status(500).json({
            success: false,
            error: "Failed to update suggested vote: " + formatError(error)
          });
        }
      }
    }

    // Return success response
    return res.json({
      success: true,
      message: "Referendum updated successfully"
    });
  } catch (error) {
    logger.error({
      error: formatError(error),
      postId: req.params.postId,
      chain: req.params.chain,
      step: 'referendum_update'
    }, "Error updating referendum");
    
    return res.status(500).json({
      success: false,
      error: "Error updating referendum: " + formatError(error)
    });
  }
});

/**
 * GET /referendums/:postId/actions
 * Get team actions for a specific referendum
 */
router.get("/:postId/actions", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid post ID" 
      });
    }

    // Validate chain parameter
    if (!chain || !Object.values(Chain).includes(chain)) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'" 
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({ 
        success: false, 
        error: `Referendum ${postId} not found on ${chain} network` 
      });
    }

    // Get actions from the database using the internal referendum ID
    const actions = await db.all(`
      SELECT rtr.*
      FROM referendum_team_roles rtr
      WHERE rtr.referendum_id = ?
      ORDER BY rtr.created_at DESC
    `, [referendum.id]);

    // Get current multisig members to enrich the data
    const teamMembers = await multisigService.getCachedTeamMembers();

    // Enrich actions with member information
    const enrichedActions = actions.map(action => {
      const member = teamMembers.find((m: { wallet_address: string }) => m.wallet_address === action.team_member_id);
      return {
        ...action,
        team_member_name: member?.team_member_name || `Multisig Member`,
        wallet_address: action.team_member_id,
        network: member?.network || "Unknown"
      };
    });

    res.json({
      success: true,
      actions: enrichedActions
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error retrieving team actions");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /referendums/:postId/actions
 * Add a team action to a referendum
 */
router.post("/:postId/actions", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, action, reason } = req.body;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }

    // Map frontend action names to backend enum values
    const actionMap: Record<string, ReferendumAction> = {
      'agree': ReferendumAction.AGREE,
      'to_be_discussed': ReferendumAction.TO_BE_DISCUSSED,
      'no_way': ReferendumAction.NO_WAY,
      'recuse': ReferendumAction.RECUSE
    };

    const backendAction = actionMap[action.toLowerCase()];
    if (!backendAction) {
      return res.status(400).json({
        success: false,
        error: "Valid action is required",
        valid_actions: Object.keys(actionMap)
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${postId} not found on ${chain} network`
      });
    }

    // Check if user has ANY existing team action (excluding responsible_person)
    const existingAction = await db.get(
      "SELECT id, role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
      [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
    );

    if (existingAction) {
      // User already has a team action - delete old and insert new (to avoid UNIQUE constraint issues)
      await db.run(
        "DELETE FROM referendum_team_roles WHERE id = ?",
        [existingAction.id]
      );
      
      // Insert the new action
      await db.run(
        "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type, reason) VALUES (?, ?, ?, ?)",
        [referendum.id, req.user.address, backendAction, reason || null]
      );
    } else {
      // Create new action
      await db.run(
        "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type, reason) VALUES (?, ?, ?, ?)",
        [referendum.id, req.user.address, backendAction, reason || null]
      );
    }

    res.json({
      success: true,
      message: "Team action added successfully"
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error adding team action");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * DELETE /referendums/:postId/actions
 * Delete a team action from a referendum
 */
router.delete("/:postId/actions", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, action } = req.body;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }

    // Map frontend action names to backend enum values
    const actionMap: Record<string, ReferendumAction> = {
      'agree': ReferendumAction.AGREE,
      'to_be_discussed': ReferendumAction.TO_BE_DISCUSSED,
      'no_way': ReferendumAction.NO_WAY,
      'recuse': ReferendumAction.RECUSE
    };

    const backendAction = actionMap[action.toLowerCase()];
    if (!backendAction) {
      return res.status(400).json({
        success: false,
        error: "Valid action type is required",
        valid_actions: Object.keys(actionMap)
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${postId} not found on ${chain} network`
      });
    }

    // Remove specific team action
    const result = await db.run(
      "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
      [referendum.id, req.user.address, backendAction]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: `No ${action} action found for this user and referendum`
      });
    }

    res.json({
      success: true,
      message: "Team action removed successfully"
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error removing team action");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /referendums/:postId/assign
 * Assign the current user as the responsible person for a referendum
 */
router.post("/:postId/assign", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain } = req.body;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${postId} not found on ${chain} network`
      });
    }

    // Check if referendum is already assigned
    const existingAssignment = await db.get(
      "SELECT team_member_id FROM referendum_team_roles WHERE referendum_id = ? AND role_type = ?",
      [referendum.id, ReferendumAction.RESPONSIBLE_PERSON]
    );

    if (existingAssignment) {
      if (existingAssignment.team_member_id === req.user.address) {
        // Already assigned to this user, just return success
        return res.json({
          success: true,
          message: "Already assigned to you"
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "This proposal is already assigned to another team member"
        });
      }
    }

    // Start a transaction to handle all changes atomically
    await db.run('BEGIN TRANSACTION');

    try {
      // Create new assignment
      await db.run(
        "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES (?, ?, ?)",
        [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
      );

      // Update referendum status to Considering if it's not already in a later stage
      await db.run(
        "UPDATE referendums SET internal_status = CASE WHEN internal_status = ? THEN ? ELSE internal_status END, updated_at = datetime('now') WHERE id = ?",
        [InternalStatus.NotStarted, InternalStatus.Considering, referendum.id]
      );

      await db.run('COMMIT');

      res.json({
        success: true,
        message: "Assigned successfully"
      });
    } catch (transactionError) {
      await db.run('ROLLBACK');
      throw transactionError;
    }
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error assigning to referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /referendums/:postId/unassign
 * Unassign the responsible person from a referendum and reset its state
 */
router.post("/:postId/unassign", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, unassignNote } = req.body;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${postId} not found on ${chain} network`
      });
    }

    // Check if user is the responsible person
    const responsibleRole = await db.get(
      "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
      [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
    );

    if (!responsibleRole) {
      return res.status(403).json({
        success: false,
        error: "Only the responsible person can unassign themselves"
      });
    }

    // Start a transaction to handle all changes atomically
    await db.run('BEGIN TRANSACTION');

    try {
      // Get current voting decision before removing role
      const votingDecision = await db.get(
        "SELECT suggested_vote FROM voting_decisions WHERE referendum_id = ?",
        [referendum.id]
      );
      const previousVote = votingDecision?.suggested_vote;

      // Remove responsible person role AND any team actions (except NO WAY)
      await db.run(
        "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
        [referendum.id, req.user.address, ReferendumAction.NO_WAY]
      );

      // Always reset suggested vote
      await db.run(
        "UPDATE voting_decisions SET suggested_vote = NULL WHERE referendum_id = ?",
        [referendum.id]
      );

      // Reset internal status and clear reason for vote
      await db.run(
        "UPDATE referendums SET internal_status = ?, updated_at = datetime('now'), reason_for_vote = NULL WHERE id = ?",
        [InternalStatus.NotStarted, referendum.id]
      );

      // Always add an unassign message, optionally with note and previous vote
      const noteLines = ['[UNASSIGN MESSAGE]'];
      if (previousVote) {
        noteLines.push(`Previous vote: ${previousVote}`);
      }
      if (unassignNote?.trim()) {
        noteLines.push(`Note: ${unassignNote.trim()}`);
      }

      await db.run(
        "INSERT INTO referendum_comments (referendum_id, team_member_id, content) VALUES (?, ?, ?)",
        [referendum.id, req.user.address, noteLines.join('\n')]
      );

      await db.run('COMMIT');

      res.json({
        success: true,
        message: "Unassigned successfully"
      });
    } catch (transactionError) {
      await db.run('ROLLBACK');
      throw transactionError;
    }
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error unassigning from referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /referendums/:postId/comments
 * Get comments for a specific referendum
 */
router.get("/:postId/comments", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid post ID" 
      });
    }

    // Validate chain parameter
    if (!chain || !Object.values(Chain).includes(chain)) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'" 
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({ 
        success: false, 
        error: `Referendum ${postId} not found on ${chain} network` 
      });
    }

    // Get comments from database
    const comments = await db.all(`
      SELECT rc.*
      FROM referendum_comments rc
      WHERE rc.referendum_id = ?
      ORDER BY rc.created_at ASC
    `, [referendum.id]);

    // Get team members to enrich the data
    const teamMembers = await multisigService.getCachedTeamMembers();

    // Enrich comments with member information
    const enrichedComments = comments.map(comment => {
      const member = teamMembers.find((m: { wallet_address: string }) => m.wallet_address === comment.team_member_id);
      return {
        id: comment.id,
        content: comment.content,
        user_address: comment.team_member_id,
        user_name: member?.team_member_name || comment.team_member_id,
        created_at: comment.created_at,
        updated_at: comment.updated_at
      };
    });

    res.json({
      success: true,
      comments: enrichedComments
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error fetching comments");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /referendums/:postId/comments
 * Add a comment to a specific referendum
 */
router.post("/:postId/comments", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, content } = req.body;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }

    // Validate content
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Comment content is required"
      });
    }

    // Get the internal referendum ID first
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${postId} not found on ${chain} network`
      });
    }

    // Insert comment
    const result = await db.run(
      "INSERT INTO referendum_comments (referendum_id, team_member_id, content) VALUES (?, ?, ?)",
      [referendum.id, req.user.address, content.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: {
        id: result.lastID,
        content: content.trim(),
        user_address: req.user.address,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error adding comment");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * DELETE /comments/:commentId
 * Delete a specific comment (only by the author)
 */
router.delete("/comments/:commentId", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    // Check if comment exists and belongs to the current user
    const comment = await db.get(
      "SELECT id, team_member_id FROM referendum_comments WHERE id = ?",
      [commentId]
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found"
      });
    }

    // Verify the comment belongs to the current user
    if (comment.team_member_id !== req.user.address) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own comments"
      });
    }

    // Delete the comment
    const result = await db.run(
      "DELETE FROM referendum_comments WHERE id = ?",
      [commentId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Comment not found or already deleted"
      });
    }

    res.json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    logger.error({ error: formatError(error), commentId: req.params.commentId }, "Error deleting comment");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

export default router; 