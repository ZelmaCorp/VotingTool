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

export default router; 