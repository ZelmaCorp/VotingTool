import { Router, Request, Response } from "express";
import { db } from "../database/connection";
import { requireTeamMember, authenticateToken } from "../middleware/auth";
import { ReferendumAction } from "../types/auth";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const router = Router();
const logger = createSubsystemLogger(Subsystem.APP);

/**
 * GET /dao/members
 * Get all multisig members from blockchain multisig data
 */
router.get("/members", authenticateToken, async (req: Request, res: Response) => {
  try {
    const members = await multisigService.getCachedTeamMembers();
    
    res.json({
      success: true,
      members: members.map(member => ({
        address: member.wallet_address,
        name: member.team_member_name || `Multisig Member (${member.network})`,
        network: member.network
      }))
    });
    
  } catch (error) {
    logger.error({ error }, "Error fetching multisig members");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/parent
 * Get the parent address if this is a proxy/delegate account
 */
router.get("/parent", authenticateToken, async (req: Request, res: Response) => {
  try {
    const parentInfo = await multisigService.getParentAddress();
    
    res.json({
      success: true,
      parent: parentInfo
    });
    
  } catch (error) {
    logger.error({ error }, "Error fetching parent address");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/referendum/:referendumId
 * Get a specific referendum with team assignments
 */
router.get("/referendum/:referendumId", async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { chain } = req.query;
    
    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }
    
    // Get referendum data with team assignments
    const sql = `
      SELECT 
        r.*,
        sc.necessity_score, sc.funding_score, sc.competition_score,
        sc.blueprint_score, sc.track_record_score, sc.reports_score,
        sc.synergy_score, sc.revenue_score, sc.security_score,
        sc.open_source_score, sc.ref_score,
        vd.suggested_vote, vd.final_vote, vd.vote_executed, vd.vote_executed_date
      FROM referendums r
      LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
      LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
      WHERE r.post_id = ? AND r.chain = ?
    `;
    
    const referendum = await db.get(sql, [referendumId, chain]);
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Get team assignments separately
    const assignmentsSql = `
      SELECT rtr.*, 
             CASE 
               WHEN rtr.role_type = 'responsible_person' THEN rtr.team_member_id
               ELSE NULL 
             END as assigned_to
      FROM referendum_team_roles rtr
      WHERE rtr.referendum_id = ?
      ORDER BY rtr.created_at DESC
    `;
    
    const assignments = await db.all(assignmentsSql, [referendum.id]);
    
    // Find who is assigned as responsible person
    const responsiblePerson = assignments.find(a => a.role_type === 'responsible_person');
    
    // Add assignment information to referendum data
    const enrichedReferendum = {
      ...referendum,
      assigned_to: responsiblePerson?.team_member_id || null,
      team_assignments: assignments
    };
    
    logger.info({ referendumId, chain, assignmentCount: assignments.length }, "Retrieved referendum with assignments");
    
    res.json({
      success: true,
      referendum: enrichedReferendum
    });
    
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error fetching referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/referendum/:referendumId/actions
 * Get governance actions for a specific referendum during discussion period
 */
router.get("/referendum/:referendumId/actions", async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { chain } = req.query;
    
    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }
    
    // First, get the internal referendum ID using post_id and chain
    const referendum = await db.get(
      "SELECT id FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
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
      // team_member_id is now the wallet address
      const member = teamMembers.find(m => m.wallet_address === action.team_member_id);
      return {
        ...action,
        team_member_name: member?.team_member_name || `Multisig Member`,
        wallet_address: action.team_member_id, // This is already the wallet address
        network: member?.network || "Unknown"
      };
    });
    
    logger.info({ referendumId, actionCount: enrichedActions.length }, "Retrieved governance actions for referendum");
    
    res.json({
      success: true,
      actions: enrichedActions
    });
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error retrieving governance actions for referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /dao/referendum/:referendumId/action
 * Assign current user to a governance action for referendum discussion
 */
router.post("/referendum/:referendumId/action", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { action, chain } = req.body;
    
    // Validate action using the enum
    if (!action || !Object.values(ReferendumAction).includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Valid action is required",
        valid_actions: Object.values(ReferendumAction),
        action_descriptions: {
          [ReferendumAction.RESPONSIBLE_PERSON]: "Lead evaluator for this referendum",
          [ReferendumAction.AGREE]: "Agree with this proposal",
          [ReferendumAction.NO_WAY]: "Oppose this proposal",
          [ReferendumAction.RECUSE]: "Abstain due to conflict of interest",
          [ReferendumAction.TO_BE_DISCUSSED]: "Needs further discussion"
        }
      });
    }
    
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
    
    // Check if referendum exists using post_id and chain
    const referendum = await db.get(
      "SELECT id, title FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Check if user already has an action for this referendum
    // Use wallet address directly as team_member_id and the internal referendum.id
    const existingAction = await db.get(
      "SELECT id, role_type FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ?",
      [referendum.id, req.user.address]
    );
    
    // Special handling for responsible_person assignment
    if (action === 'responsible_person') {
      // Check if someone else is already assigned as responsible person
      const currentResponsible = await db.get(
        "SELECT team_member_id FROM referendum_team_roles WHERE referendum_id = ? AND role_type = 'responsible_person'",
        [referendum.id]
      );
      
      if (currentResponsible && currentResponsible.team_member_id !== req.user.address) {
        return res.status(409).json({
          success: false,
          error: `This proposal is already assigned to another team member. Please ask them to unassign first, or contact an admin.`,
          current_assignee: currentResponsible.team_member_id
        });
      }
    }
    
    if (existingAction) {
      // Update existing action
      await db.run(
        "UPDATE referendum_team_roles SET role_type = ? WHERE id = ?",
        [action, existingAction.id]
      );
      
      logger.info({ 
        walletAddress: req.user.address, 
        referendumId, 
        oldAction: existingAction.role_type,
        newAction: action 
      }, "User governance action updated for referendum");
      
      res.json({
        success: true,
        message: "Governance action updated successfully",
        action: {
          id: existingAction.id,
          action,
          referendum_id: referendum.id,
          post_id: referendumId,
          chain: chain,
          team_member_id: req.user.address
        }
      });
    } else {
      // Create new action assignment
      const result = await db.run(
        "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES (?, ?, ?)",
        [referendum.id, req.user.address, action]
      );
      
      logger.info({ 
        walletAddress: req.user.address, 
        referendumId, 
        action 
      }, "User assigned governance action for referendum");
      
      res.status(201).json({
        success: true,
        message: "Governance action assigned successfully",
        action: {
          id: result.lastID,
          action,
          referendum_id: referendum.id,
          post_id: referendumId,
          chain: chain,
          team_member_id: req.user.address
        }
      });
    }
    
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error assigning user governance action for referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/referendum/:referendumId/agreement-summary
 * Get agreement summary for a specific referendum
 */
router.get("/referendum/:referendumId/agreement-summary", async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { chain } = req.query;
    
    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }
    
    // Check if referendum exists using post_id and chain
    const referendum = await db.get(
      "SELECT id, title FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Get all team actions for this referendum
    const actions = await db.all(`
      SELECT rtr.team_member_id as wallet_address, rtr.role_type, rtr.created_at
      FROM referendum_team_roles rtr
      WHERE rtr.referendum_id = ?
      ORDER BY rtr.created_at DESC
    `, [referendum.id]);
    
    // Get team members from multisig service for member names
    const teamMembers = await multisigService.getCachedTeamMembers();
    
    // Process actions into agreement summary
    const agreed_members: Array<{ address: string; name: string }> = [];
    const pending_members: Array<{ address: string; name: string }> = [];
    const recused_members: Array<{ address: string; name: string }> = [];
    const to_be_discussed_members: Array<{ address: string; name: string }> = [];
    let vetoed = false;
    let veto_by: string | null = null;
    let veto_reason: string | null = null;
    
    // Create a map of all team members
    const allMembers = teamMembers.map(member => ({
      address: member.wallet_address,
      name: member.team_member_name || `Multisig Member (${member.network})`
    }));
    
    // Process actions with flexible address matching
    const actionMap = new Map();
    actions.forEach(action => {
      actionMap.set(action.wallet_address, action);
    });
    
    allMembers.forEach(member => {
      // Try to find action for this member with flexible address matching
      let action = actionMap.get(member.address);
      
      // If no direct match, try to find by flexible address matching
      if (!action) {
        for (const [actionAddress, actionData] of actionMap.entries()) {
          const matchingMember = multisigService.findMemberByAddress(teamMembers, actionAddress, chain as "Polkadot" | "Kusama");
          if (matchingMember && matchingMember.wallet_address === member.address) {
            action = actionData;
            break;
          }
        }
      }
      
      if (!action) {
        // No action taken - pending
        pending_members.push(member);
      } else {
        switch (action.role_type) {
          case 'agree':
            agreed_members.push(member);
            break;
          case 'no_way':
            vetoed = true;
            veto_by = member.name;
            // TODO: Get veto reason from a separate field or table
            break;
          case 'recuse':
            recused_members.push(member);
            break;
          case 'to_be_discussed':
            to_be_discussed_members.push(member);
            break;
          case 'responsible_person':
            // Responsible person doesn't count as agreement by default
            pending_members.push(member);
            break;
          default:
            pending_members.push(member);
        }
      }
    });
    
    const summary = {
      total_agreements: agreed_members.length,
      required_agreements: 4, // Default, could be configurable
      agreed_members,
      pending_members,
      recused_members,
      to_be_discussed_members,
      vetoed,
      veto_by,
      veto_reason
    };
    
    logger.info({ referendumId, chain, summary }, "Retrieved agreement summary");
    
    res.json({
      success: true,
      summary
    });
    
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error fetching agreement summary");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/referendum/:referendumId/comments
 * Get comments for a specific referendum
 */
router.get("/referendum/:referendumId/comments", async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { chain } = req.query;
    
    // Validate chain parameter
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }
    
    // Check if referendum exists using post_id and chain
    const referendum = await db.get(
      "SELECT id, title FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Get comments from database
    const comments = await db.all(`
      SELECT rc.*
      FROM referendum_comments rc
      WHERE rc.referendum_id = ?
      ORDER BY rc.created_at ASC
    `, [referendum.id]);
    
    // Get team members from multisig service for member names
    const teamMembers = await multisigService.getCachedTeamMembers();
    
    // Enrich comments with member information using flexible address matching
    const enrichedComments = comments.map(comment => {
      const member = multisigService.findMemberByAddress(teamMembers, comment.team_member_id, chain as "Polkadot" | "Kusama");
      return {
        id: comment.id,
        content: comment.content,
        user_address: comment.team_member_id,
        user_name: member?.team_member_name || comment.team_member_id,
        created_at: comment.created_at,
        updated_at: comment.updated_at
      };
    });
    
    logger.info({ referendumId, chain, commentCount: enrichedComments.length }, "Retrieved comments for referendum");
    
    res.json({
      success: true,
      comments: enrichedComments
    });
    
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error fetching comments");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /dao/referendum/:referendumId/comments
 * Add a comment to a specific referendum
 */
router.post("/referendum/:referendumId/comments", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
    const { chain, content } = req.body;
    
    // Validate parameters
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: "Chain parameter is required"
      });
    }
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Comment content is required"
      });
    }
    
    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }
    
    // Check if referendum exists using post_id and chain
    const referendum = await db.get(
      "SELECT id, title FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Insert comment into database
    const result = await db.run(
      "INSERT INTO referendum_comments (referendum_id, team_member_id, content) VALUES (?, ?, ?)",
      [referendum.id, req.user.address, content.trim()]
    );
    
    logger.info({ 
      walletAddress: req.user.address, 
      referendumId, 
      chain,
      commentId: result.lastID,
      contentLength: content.length 
    }, "Comment added to referendum");
    
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
    logger.error({ error, referendumId: req.params.referendumId }, "Error adding comment");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * DELETE /dao/referendum/:referendumId/action
 * Remove current user's governance action from a referendum
 */
router.delete("/referendum/:referendumId/action", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const { referendumId } = req.params;
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
    const referendum = await db.get(
      "SELECT id FROM referendums WHERE post_id = ? AND chain = ?",
      [referendumId, chain]
    );
    
    if (!referendum) {
      return res.status(404).json({
        success: false,
        error: `Referendum ${referendumId} not found on ${chain} network`
      });
    }
    
    // Remove user's action for this referendum
    // Use wallet address directly as team_member_id and the internal referendum.id
    const result = await db.run(
      "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ?",
      [referendum.id, req.user.address]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "No governance action found for this user and referendum"
      });
    }
    
    logger.info({ 
      walletAddress: req.user.address, 
      referendumId 
    }, "User governance action removed from referendum");
    
    res.json({
      success: true,
      message: "Governance action removed successfully"
    });
    
  } catch (error) {
    logger.error({ error, referendumId: req.params.referendumId }, "Error removing user governance action from referendum");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * DELETE /dao/comments/:commentId
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
    
    logger.info({ 
      walletAddress: req.user.address, 
      commentId 
    }, "Comment deleted successfully");
    
    res.json({
      success: true,
      message: "Comment deleted successfully"
    });
    
  } catch (error) {
    logger.error({ error, commentId: req.params.commentId }, "Error deleting comment");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

export default router; 