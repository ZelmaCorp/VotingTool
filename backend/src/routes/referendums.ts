import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { Chain } from '../types/properties';
import { createSubsystemLogger } from '../config/logger';
import { Subsystem } from '../types/logging';
import { db } from '../database/connection';

const logger = createSubsystemLogger(Subsystem.APP);
const router = Router();

// Get all referendums from the database
router.get("/", async (req: Request, res: Response) => {
  try {
    const referendums = await Referendum.getAll();
    res.json(referendums);
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error fetching referendums from database");
    res.status(500).json({ error: "Error fetching referendums: " + (error as any).message });
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
    logger.error({ error: (error as any).message }, "Error fetching referendum from database");
    res.status(500).json({ 
      success: false, 
      error: "Error fetching referendum: " + (error as any).message 
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
      
      // If suggested_vote is being updated, automatically set the user to "agree"
      // This assumes the person changing suggested vote is the evaluator/responsible person
      if (votingFields.suggested_vote && req.user?.address) {
        try {
          // Check if user is assigned as responsible person for this referendum
          const existingAssignment = await db.get(
            "SELECT role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = 'responsible_person'",
            [referendum.id, req.user.address]
          );
          
          if (existingAssignment) {
            // Auto-set to agree when evaluator changes suggested vote
            await db.run(
              "INSERT OR REPLACE INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES (?, ?, 'agree')",
              [referendum.id, req.user.address]
            );
            
            logger.info({ 
              walletAddress: req.user.address, 
              postId, 
              chain,
              suggestedVote: votingFields.suggested_vote 
            }, "Auto-set evaluator to 'agree' after changing suggested vote");
          }
        } catch (autoAgreeError) {
          logger.warn({ autoAgreeError, walletAddress: req.user.address, postId }, "Failed to auto-set evaluator to agree");
        }
      }
    }

    // Return the updated referendum with all related data
    const updatedReferendum = await Referendum.findByPostIdAndChain(postId, chain);
    res.json(updatedReferendum);
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error updating referendum");
    res.status(500).json({ error: "Error updating referendum: " + (error as any).message });
  }
});

export default router; 