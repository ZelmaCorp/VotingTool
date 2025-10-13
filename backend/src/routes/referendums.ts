import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { Chain, InternalStatus } from '../types/properties';
import { isValidTransition, getNextStatus, canManuallySetStatus, getTransitionErrorMessage } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';

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

export default router; 