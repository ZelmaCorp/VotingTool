import { Router, Request, Response } from "express";
import { db } from "../database/connection";
import { VotingDecision } from "../database/models/votingDecision";
import { requireTeamMember, authenticateToken } from "../middleware/auth";
import { ReferendumAction } from "../types/auth";
import { InternalStatus } from "../types/properties";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { refreshReferendas } from "../refresh";

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
    logger.error({ error: formatError(error) }, "Error fetching multisig members");
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
    logger.error({ error: formatError(error) }, "Error fetching parent address");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/config
 * Get DAO configuration including multisig addresses and team info
 */
router.get("/config", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get team members and threshold from multisig
    const members = await multisigService.getCachedTeamMembers();
    const requiredAgreements = await multisigService.getMultisigThreshold();
    
    // Get multisig addresses from environment
    const polkadotMultisig = process.env.POLKADOT_MULTISIG;
    const kusamaMultisig = process.env.KUSAMA_MULTISIG;
    
    // Determine primary multisig (use Polkadot if available, otherwise Kusama)
    const multisigAddress = polkadotMultisig || kusamaMultisig;
    
    res.json({
      success: true,
      config: {
        name: 'OpenGov Voting Tool',
        team_members: members.map(member => ({
          address: member.wallet_address,
          name: member.team_member_name || `Multisig Member (${member.network})`,
          network: member.network
        })),
        required_agreements: requiredAgreements,
        multisig_address: multisigAddress,
        polkadot_multisig: polkadotMultisig,
        kusama_multisig: kusamaMultisig
      }
    });
    
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching DAO config");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// DELETED: GET /dao/referendum/:referendumId - Use GET /referendums/:postId instead

// DELETED: GET /dao/referendum/:referendumId/actions - Use GET /referendums/:postId/actions instead

/**
 * GET /dao/referendum/:referendumId/agreement-summary
 * Get agreement summary for a specific referendum during discussion period
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
      SELECT rtr.team_member_id as wallet_address, rtr.role_type, rtr.reason, rtr.created_at
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
    // Group actions by member address (members can have multiple role types)
    const actionsByMember = new Map<string, any[]>();
    actions.forEach(action => {
      const existing = actionsByMember.get(action.wallet_address) || [];
      existing.push(action);
      actionsByMember.set(action.wallet_address, existing);
    });
    
    // Debug: Log actions for proposal 1752
    if (referendumId === '1752') {
      console.log('🔍 Debug proposal 1752 actions:', actions);
    }
    
    allMembers.forEach(member => {
      // Try to find actions for this member with flexible address matching
      let memberActions = actionsByMember.get(member.address);
      
      // If no direct match, try to find by flexible address matching
      if (!memberActions) {
        for (const [actionAddress, actionsData] of actionsByMember.entries()) {
          const matchingMember = multisigService.findMemberByAddress(teamMembers, actionAddress, chain as "Polkadot" | "Kusama");
          if (matchingMember && matchingMember.wallet_address === member.address) {
            memberActions = actionsData;
            // Debug: Log flexible matching for proposal 1752
            if (referendumId === '1752') {
              console.log('🔄 Flexible match found:', {
                searchAddress: actionAddress,
                foundMember: member.name,
                actionsData: actionsData
              });
            }
            break;
          }
        }
      }
      
      // Filter out RESPONSIBLE_PERSON since it's a role, not an action state
      const actionStates = memberActions?.filter(a => a.role_type !== ReferendumAction.RESPONSIBLE_PERSON) || [];
      
      if (actionStates.length === 0) {
        // No action state taken - pending
        pending_members.push(member);
      } else {
        // Check actions in priority order: NO_WAY > AGREE > RECUSE > TO_BE_DISCUSSED
        const hasNoWay = actionStates.some(a => a.role_type === ReferendumAction.NO_WAY);
        const hasAgree = actionStates.some(a => a.role_type === ReferendumAction.AGREE);
        const hasRecuse = actionStates.some(a => a.role_type === ReferendumAction.RECUSE);
        const hasToBeDiscussed = actionStates.some(a => a.role_type === ReferendumAction.TO_BE_DISCUSSED);
        
        if (hasNoWay) {
          const noWayAction = actionStates.find(a => a.role_type === ReferendumAction.NO_WAY);
          vetoed = true;
          veto_by = member.name;
          veto_reason = noWayAction?.reason || null;
          // Debug: Log veto details for proposal 1752
          if (referendumId === '1752') {
            console.log('🚫 Debug veto action:', {
              member: member.name,
              action_reason: noWayAction?.reason,
              veto_reason: veto_reason
            });
          }
        } else if (hasAgree) {
          agreed_members.push(member);
        } else if (hasRecuse) {
          recused_members.push(member);
        } else if (hasToBeDiscussed) {
          to_be_discussed_members.push(member);
        } else {
          // No recognized action state - counts as pending
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
    logger.error({ error: formatError(error), referendumId: req.params.referendumId }, "Error fetching agreement summary");
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
router.delete("/comments/:commentId", requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }
    // Check if comment exists and belongs to the current user
    const comment = await db.get(
      "SELECT id, team_member_id FROM referendum_comments WHERE id = ?",
      [req.params.commentId]
    );
    
  } catch (error) {
    logger.error({ 
      error: formatError(error), 
      referendumId: req.params.referendumId,
      chain: req.body.chain,
      walletAddress: req.user?.address,
      body: req.body,
      step: 'outer'
    }, "Error removing user governance action from referendum");
    
    // Check if it's a transaction error that was re-thrown
    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
      res.status(409).json({
        success: false,
        error: "Database constraint violation. Please try again."
      });
    } else {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  }
});

/**
 * DELETE /dao/comments/:commentId
 * Delete a specific comment (only by the author)
 */

/**
 * GET /dao/my-assignments
 * Get all referendums assigned to the current user
 */
router.get("/my-assignments", requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.user?.address) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found"
      });
    }

    const referendums = await Referendum.getAssignedToUser(req.user.address);
    
    logger.info({ 
      walletAddress: req.user.address,
      count: referendums.length 
    }, "Retrieved user's assigned referendums");

    res.json({
      success: true,
      referendums
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error retrieving user's assigned referendums");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * GET /dao/workflow
 * Get all workflow data in a single request
 */
router.get("/workflow", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get team members from multisig service for counting
    const teamMembers = await multisigService.getCachedTeamMembers();
    const totalTeamMembers = teamMembers.length;

    // Get all referendums with their actions
    const allReferendums = await db.all(`
      SELECT r.*
        FROM referendums r
      ORDER BY r.created_at DESC
    `);

    // Get all team actions
    const allActions = await db.all(`
        SELECT 
        referendum_id,
        team_member_id,
        role_type,
        reason,
        created_at
      FROM referendum_team_roles
    `);

    // Group actions by referendum_id
    const actionsByReferendum = new Map<number, any[]>();
    allActions.forEach((action: any) => {
      if (!actionsByReferendum.has(action.referendum_id)) {
        actionsByReferendum.set(action.referendum_id, []);
      }
      actionsByReferendum.get(action.referendum_id)!.push(action);
    });

    // Helper to check if referendum has NO WAY action
    const hasVeto = (referendumId: number) => {
      const actions = actionsByReferendum.get(referendumId) || [];
      return actions.some(a => a.role_type === ReferendumAction.NO_WAY);
    };

    // Helper to check if referendum has "to_be_discussed" action
    const hasDiscussionFlag = (referendumId: number) => {
      const actions = actionsByReferendum.get(referendumId) || [];
      return actions.some(a => a.role_type === ReferendumAction.TO_BE_DISCUSSED);
    };

    // Helper to count "agree" actions
    const countAgreeActions = (referendumId: number) => {
      const actions = actionsByReferendum.get(referendumId) || [];
      return actions.filter(a => a.role_type === ReferendumAction.AGREE).length;
    };

    // Helper to get veto info
    const getVetoInfo = (referendumId: number) => {
      const actions = actionsByReferendum.get(referendumId) || [];
      const vetoAction = actions.find(a => a.role_type === ReferendumAction.NO_WAY);
      if (vetoAction) {
        const member = multisigService.findMemberByAddress(teamMembers, vetoAction.team_member_id);
        return {
          veto_by: vetoAction.team_member_id,
          veto_by_name: member?.team_member_name || 'Unknown Member',
          veto_reason: vetoAction.reason,
          veto_date: vetoAction.created_at
        };
      }
      return null;
    };

    // Categorize referendums
    const needsAgreement: any[] = [];
    const readyToVote: any[] = [];
    const forDiscussion: any[] = [];
    const vetoedProposals: any[] = [];

    allReferendums.forEach((ref: any) => {
      const refId = ref.id;
      const agreeCount = countAgreeActions(refId);
      
      // Add agreement_count and required_agreements for all
      ref.agreement_count = agreeCount;
      ref.required_agreements = totalTeamMembers;

      if (hasVeto(refId)) {
        // Vetoed proposals (highest priority)
        const vetoInfo = getVetoInfo(refId);
        vetoedProposals.push({ ...ref, ...vetoInfo });
      } else if (ref.internal_status === InternalStatus.ReadyToVote) {
        // Ready to vote (voted proposals shouldn't be in discussion)
        readyToVote.push(ref);
      } else if (
        ref.internal_status.startsWith('Voted') // "Voted 👍 Aye 👍", "Voted 👎 Nay 👎", "Voted ✌️ Abstain ✌️"
      ) {
        // Already voted - don't show in any workflow category
        // These are historical and shouldn't appear in active workflow
      } else if (
        (ref.internal_status === InternalStatus.WaitingForAgreement ||
         ref.internal_status === InternalStatus.ReadyForApproval) &&
        agreeCount < totalTeamMembers
      ) {
        // Needs agreement (active proposals in agreement phase)
        needsAgreement.push(ref);
      } else if (hasDiscussionFlag(refId) && agreeCount === 0) {
        // For discussion (only if no agreements have been made yet)
        // Once people start agreeing, it moves out of "discussion" phase
        forDiscussion.push(ref);
      }
    });

    // For each proposal, get team actions separately
    const addTeamActions = async (proposals: any[]) => {
      for (const proposal of proposals) {
        const actions = await db.all(`
          SELECT 
            team_member_id,
            role_type,
            reason,
            created_at
          FROM referendum_team_roles
          WHERE referendum_id = ?
        `, [proposal.id]);

        // Split actions into role assignments and action states
        const roleAssignments = new Map<string, any>();
        const actionStates = new Map<string, any>();
        
        // First pass: collect all actions with timestamps
        const memberActions = new Map<string, { action: any, timestamp: Date }[]>();
        
        actions.forEach((action: any) => {
          // Use flexible address matching to find the canonical team member
          const member = multisigService.findMemberByAddress(teamMembers, action.team_member_id);
          const canonicalAddress = member?.wallet_address || action.team_member_id;
          
          const actionData = {
            team_member_id: canonicalAddress,
            wallet_address: canonicalAddress, // For frontend compatibility
            role_type: action.role_type,
            reason: action.reason,
            created_at: action.created_at,
            team_member_name: member?.team_member_name || 'Unknown Member'
          };
          
          const existing = memberActions.get(canonicalAddress) || [];
          existing.push({
            action: actionData,
            timestamp: new Date(action.created_at)
          });
          memberActions.set(canonicalAddress, existing);
        });
        
        // Second pass: process each member's actions
        memberActions.forEach((memberActionList, canonicalAddress) => {
          // Sort actions by timestamp, newest first
          memberActionList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          
          // Find role assignment (RESPONSIBLE_PERSON) if it exists
          const roleAction = memberActionList.find(a => a.action.role_type === ReferendumAction.RESPONSIBLE_PERSON);
          if (roleAction) {
            roleAssignments.set(canonicalAddress, roleAction.action);
          }
          
          // Find the latest non-RESPONSIBLE_PERSON action (there should only be one after our SET changes)
          const latestActionState = memberActionList.find(a => a.action.role_type !== ReferendumAction.RESPONSIBLE_PERSON);
          if (latestActionState) {
            actionStates.set(canonicalAddress, latestActionState.action);
          }
        });

        // Add role assignments and action states separately
        proposal.role_assignments = Array.from(roleAssignments.values());
        proposal.team_actions = Array.from(actionStates.values());
        
        // Set assigned_to field using the canonical address from role_assignments
        const responsiblePerson = Array.from(roleAssignments.values()).find(
          (ra: any) => ra.role_type === ReferendumAction.RESPONSIBLE_PERSON
        );
        proposal.assigned_to = responsiblePerson?.wallet_address || null;
      }
    };

    // Add team actions to all proposal lists
    await Promise.all([
      addTeamActions(needsAgreement),
      addTeamActions(readyToVote),
      addTeamActions(forDiscussion),
      addTeamActions(vetoedProposals)
    ]);

    // For vetoed proposals, add proper veto_by_name using flexible address matching
    vetoedProposals.forEach((proposal: any) => {
      const member = multisigService.findMemberByAddress(teamMembers, proposal.veto_by);
      proposal.veto_by_name = member?.team_member_name || 'Unknown Member';
    });

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
 * POST /dao/sync
 * Trigger data synchronization with Polkassembly
 * Supports both normal sync (limit=30) and deep sync (limit=100+)
 */
router.post("/sync", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type = 'normal' } = req.body;
    
    // Validate sync type
    if (type !== 'normal' && type !== 'deep') {
      return res.status(400).json({
        success: false,
        error: "Sync type must be 'normal' or 'deep'"
      });
    }
    
    // Set limit based on sync type
    const limit = type === 'deep' ? 100 : 30;
    
    logger.info({ 
      syncType: type, 
      limit,
      requestedBy: req.user?.address 
    }, `Starting ${type} sync operation`);
    
    // Start refresh in background (don't await to return immediately)
    refreshReferendas(limit).catch(error => {
      logger.error({ 
        error: formatError(error), 
        syncType: type, 
        limit,
        requestedBy: req.user?.address 
      }, `${type} sync failed`);
    });
    
    // Return immediately
    res.json({
      success: true,
      message: `${type === 'deep' ? 'Deep' : 'Normal'} sync started successfully`,
      type: type,
      limit: limit,
      timestamp: new Date().toISOString(),
      status: "started"
    });
    
  } catch (error) {
    logger.error({ 
      error: formatError(error), 
      requestedBy: req.user?.address 
    }, "Error starting sync operation");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/**
 * POST /dao/cleanup-duplicate-actions
 * Clean up duplicate team actions (e.g., when user has both "to_be_discussed" and "agree")
 * This removes "to_be_discussed" entries when a more substantive action exists
 */
router.post("/cleanup-duplicate-actions", async (req: Request, res: Response) => {
  try {
    logger.info({ 
      requestedBy: 'public' 
    }, "Starting cleanup of duplicate team actions");

    // First, find all duplicates to report what will be deleted
    const duplicates = await db.all(`
      SELECT 
        rtr1.id,
        rtr1.referendum_id,
        rtr1.team_member_id,
        rtr1.role_type,
        r.post_id,
        r.title
      FROM referendum_team_roles rtr1
      INNER JOIN referendums r ON rtr1.referendum_id = r.id
      WHERE rtr1.role_type = 'to_be_discussed'
        AND EXISTS (
          SELECT 1 
          FROM referendum_team_roles rtr2 
          WHERE rtr2.referendum_id = rtr1.referendum_id 
            AND rtr2.team_member_id = rtr1.team_member_id
            AND rtr2.role_type IN ('agree', 'recuse', 'no_way')
        )
    `);

    logger.info({ 
      duplicateCount: duplicates.length,
      duplicates: duplicates.map(d => ({ 
        id: d.id, 
        post_id: d.post_id, 
        title: d.title 
      }))
    }, "Found duplicate 'to_be_discussed' entries");

    // Now delete them
    const result = await db.run(`
      DELETE FROM referendum_team_roles
      WHERE id IN (
        SELECT rtr1.id
        FROM referendum_team_roles rtr1
        WHERE rtr1.role_type = 'to_be_discussed'
          AND EXISTS (
            SELECT 1 
            FROM referendum_team_roles rtr2 
            WHERE rtr2.referendum_id = rtr1.referendum_id 
              AND rtr2.team_member_id = rtr1.team_member_id
              AND rtr2.role_type IN ('agree', 'recuse', 'no_way')
          )
      )
    `);

    logger.info({ 
      deletedCount: result.changes,
      requestedBy: 'public' 
    }, "Cleanup completed successfully");

    res.json({
      success: true,
      message: "Duplicate team actions cleaned up successfully",
      deletedCount: result.changes,
      duplicatesFound: duplicates.length,
      details: duplicates.map(d => ({
        referendum_id: d.referendum_id,
        post_id: d.post_id,
        title: d.title,
        team_member_id: d.team_member_id
      }))
    });

  } catch (error) {
    logger.error({ 
      error: formatError(error), 
      requestedBy: 'public' 
    }, "Error during cleanup operation");
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

export default router; 