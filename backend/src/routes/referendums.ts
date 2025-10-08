import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { Chain, InternalStatus } from '../types/properties';
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
      await Referendum.update(postId, chain, referendumFields);
    }

    // Update voting decision fields if any
    if (Object.keys(votingFields).length > 0) {
      await VotingDecision.upsert(referendum.id!, votingFields);
      
      // If suggested_vote is being updated, automatically update the user's action state
      // This assumes the person changing suggested vote is the evaluator/responsible person
      if (votingFields.suggested_vote && req.user?.address) {
        try {
          // Check if user is assigned as responsible person for this referendum
          const existingAssignment = await db.get(
            "SELECT role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
            [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
          );
          
          if (existingAssignment) {
            // Get all current action states for this user
            const existingActions = await db.all(
              "SELECT id, role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
              [referendum.id, req.user.address, ReferendumAction.RESPONSIBLE_PERSON]
            );

            // Delete all existing action states (but keep RESPONSIBLE_PERSON)
            if (existingActions.length > 0) {
              const actionIds = existingActions.map(a => a.id).join(',');
              await db.run(
                `DELETE FROM referendum_team_roles WHERE id IN (${actionIds})`
              );
            }

            // When setting any suggested vote, the user automatically agrees with their decision
            await db.run(
              "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type, reason) VALUES (?, ?, ?, ?)",
              [referendum.id, req.user.address, ReferendumAction.AGREE, votingFields.reason_for_vote || null]
            );
            
            logger.info({ 
              walletAddress: req.user.address, 
              postId, 
              chain,
              suggestedVote: votingFields.suggested_vote,
              removedActions: existingActions.map(a => a.role_type)
            }, "Auto-set evaluator to 'Agree' after setting suggested vote");
          }
        } catch (autoAgreeError) {
          logger.warn({ autoAgreeError, walletAddress: req.user.address, postId }, "Failed to auto-update evaluator action state");
        }
      }
      
      // Check if we need to auto-transition status to "Ready to vote"
      if (votingFields.suggested_vote && referendum.internal_status === InternalStatus.WaitingForAgreement) {
        try {
          const { multisigService } = await import('../services/multisig');
          const teamMembers = await multisigService.getCachedTeamMembers();
          const totalTeamMembers = teamMembers.length;
          
          // Count total agreements
          const agreementCount = await db.get(
            "SELECT COUNT(DISTINCT team_member_id) as count FROM referendum_team_roles WHERE referendum_id = ? AND role_type = ?",
            [referendum.id, ReferendumAction.AGREE]
          );
          
          // Check if NO WAY exists
          const noWay = await db.get(
            "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND role_type = ? LIMIT 1",
            [referendum.id, ReferendumAction.NO_WAY]
          );
          
          if (!noWay && agreementCount && agreementCount.count >= totalTeamMembers) {
            // All team members have agreed, transition to "Ready to vote"
            await db.run(
              "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
              [InternalStatus.ReadyToVote, referendum.id]
            );
            
            logger.info({
              referendumId: referendum.id,
              postId,
              chain,
              agreementCount: agreementCount.count,
              requiredAgreements: totalTeamMembers
            }, "Auto-transitioned to 'Ready to vote' after reaching agreement threshold");
          }
        } catch (transitionError) {
          logger.warn({ transitionError, postId }, "Failed to check/transition status to Ready to vote");
        }
      }
    }

    // Return the updated referendum with all related data
    const updatedReferendum = await Referendum.findByPostIdAndChain(postId, chain);
    res.json(updatedReferendum);
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error updating referendum");
    res.status(500).json({ error: "Error updating referendum: " + formatError(error) });
  }
});

export default router; 