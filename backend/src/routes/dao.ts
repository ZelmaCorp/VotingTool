import { Router, Request, Response } from "express";
import { db } from "../database/connection";
import { requireTeamMember, authenticateToken, addDaoContext, requireDaoMembership } from "../middleware/auth";
import { Chain } from "../types/properties";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { refreshReferendas } from "../refresh";
import { DAO } from "../database/models/dao";
import { DaoService } from "../services/daoService";

const router = Router();
const logger = createSubsystemLogger(Subsystem.APP);

// Import helpers from utils
import {
  verifySignature,
  validateRegistrationInput,
  performMultisigVerifications,
  createDaoFromRegistration
} from '../utils/daoRegistration';

import {
  getChainFromQuery,
  createActionCheckers,
  categorizeReferendums,
  findDuplicateDiscussionActions,
  deleteDuplicateDiscussionActions,
  addTeamActionsToProposals
} from '../utils/daoWorkflow';

/**
 * IMPORTANT: Specific routes must come BEFORE parameterized routes!
 * /dao/config must be before /dao/:daoId or Express will match "config" as daoId
 */

/** POST /dao/register - Register a new DAO with wallet-based authentication */
router.post("/register", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, polkadotMultisig, kusamaMultisig, walletAddress, signature, message } = req.body;
    
    // Validate input
    const errors = validateRegistrationInput(req.body);
    if (errors.length > 0) return res.status(400).json({ success: false, errors });
    
    // Verify signature
    if (!verifySignature(walletAddress, message, signature)) {
      logger.warn({ walletAddress }, 'Failed signature verification');
      return res.status(403).json({ success: false, error: 'Invalid signature. Please sign the message with your wallet.' });
    }
    
    // Verify message content and DAO name availability
    if (!message.includes(name)) return res.status(400).json({ success: false, error: 'Message must include the DAO name for verification' });
    if (await DAO.getByName(name.trim())) return res.status(409).json({ success: false, error: 'DAO with this name already exists' });
    
    // Verify multisigs on-chain
    const verification = await performMultisigVerifications(polkadotMultisig, kusamaMultisig, walletAddress);
    if (!verification.success) return res.status(verification.errors![0].includes('member') ? 403 : 400).json({ success: false, errors: verification.errors });
    
    // Create DAO
    const daoId = await createDaoFromRegistration(name, description, polkadotMultisig, kusamaMultisig);
    
    logger.info({ daoId, name: name.trim(), walletAddress, chains: verification.chains }, 'DAO registered');
    res.status(201).json({ 
      success: true, 
      message: 'DAO registered successfully', 
      dao: { id: daoId, name: name.trim(), description: description?.trim() || null, chains: verification.chains, status: 'active' } 
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, 'Error registering DAO');
    res.status(500).json({ success: false, error: 'Internal server error during DAO registration' });
  }
});

/**
 * GET /dao/members
 * Get all multisig members from blockchain multisig data
 */
router.get("/members", authenticateToken, addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    const chain = getChainFromQuery(req.query);
    const members = await DaoService.getMembers(req.daoId!, chain);
    
    res.json({ success: true, members });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching multisig members");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /dao/parent
 * Get the parent address if this is a proxy/delegate account
 */
router.get("/parent", authenticateToken, addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    const chain = getChainFromQuery(req.query);
    const multisigAddress = await DAO.getDecryptedMultisig(req.daoId!, chain);
    
    if (!multisigAddress) {
      return res.status(404).json({ success: false, error: 'No multisig configured for this chain' });
    }
    
    const parentInfo = await multisigService.getParentAddress(multisigAddress, chain);
    res.json({ success: true, parent: parentInfo });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching parent address");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /dao/config
 * Get DAO configuration including multisig addresses and team info
 */
router.get("/config", authenticateToken, addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    const daoId = req.daoId!;
    const dao = await DAO.getById(daoId);
    if (!dao) {
      return res.status(404).json({ success: false, error: 'DAO not found' });
    }
    
    const chain = getChainFromQuery(req.query);
    const info = await DaoService.getMultisigInfo(daoId, chain);
    const teamMembers = await DaoService.getMembers(daoId, chain);
    
    // Get multisig addresses
    const polkadotMultisig = await DAO.getDecryptedMultisig(daoId, Chain.Polkadot);
    const kusamaMultisig = await DAO.getDecryptedMultisig(daoId, Chain.Kusama);
    
    res.json({
      success: true,
      config: {
        name: dao.name,
        team_members: teamMembers,
        required_agreements: info?.threshold || 4,
        multisig_address: polkadotMultisig || kusamaMultisig,
        polkadot_multisig: polkadotMultisig,
        kusama_multisig: kusamaMultisig
      }
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error fetching DAO config");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETED: GET /dao/referendum/:referendumId - Use GET /referendums/:postId instead
// DELETED: GET /dao/referendum/:referendumId/actions - Use GET /referendums/:postId/actions instead
// DELETED: GET /dao/referendum/:referendumId/agreement-summary - Moved to GET /referendums/:postId/agreement-summary

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
router.get("/workflow", authenticateToken, addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    const daoId = req.daoId!;
    const chain = getChainFromQuery(req.query);
    const teamMembers = await DaoService.getMembers(daoId, chain);
    const totalTeamMembers = teamMembers.length;

    // Get all referendums and actions for this DAO
    const allReferendums = await db.all(`SELECT r.* FROM referendums r WHERE r.dao_id = ? ORDER BY r.created_at DESC`, [daoId]);
    const allActions = await db.all(`
      SELECT referendum_id, team_member_id, role_type, reason, created_at
      FROM referendum_team_roles
      WHERE dao_id = ?
    `, [daoId]);

    // Group actions by referendum
    const actionsByReferendum = new Map<number, any[]>();
    allActions.forEach((action: any) => {
      if (!actionsByReferendum.has(action.referendum_id)) {
        actionsByReferendum.set(action.referendum_id, []);
      }
      actionsByReferendum.get(action.referendum_id)!.push(action);
    });

    // Create checkers and categorize
    const checkers = createActionCheckers(actionsByReferendum, teamMembers);
    const { needsAgreement, readyToVote, forDiscussion, vetoedProposals } = 
      categorizeReferendums(allReferendums, checkers, totalTeamMembers);

    // Add team actions to all lists
    await Promise.all([
      addTeamActionsToProposals(needsAgreement, teamMembers),
      addTeamActionsToProposals(readyToVote, teamMembers),
      addTeamActionsToProposals(forDiscussion, teamMembers),
      addTeamActionsToProposals(vetoedProposals, teamMembers)
    ]);

    // Fix veto_by_name with flexible address matching
    vetoedProposals.forEach((proposal: any) => {
      const member = multisigService.findMemberByAddress(teamMembers, proposal.veto_by);
      proposal.veto_by_name = member?.team_member_name || 'Unknown Member';
    });

    res.json({
      success: true,
      data: { needsAgreement, readyToVote, forDiscussion, vetoedProposals }
    });
  } catch (error) {
    logger.error({ error: formatError(error) }, 'Failed to get workflow data');
    res.status(500).json({ success: false, error: 'Failed to get workflow data' });
  }
});

/**
 * POST /dao/sync
 * Trigger data synchronization with Polkassembly
 * Supports both normal sync (limit=30) and deep sync (limit=100+)
 */
router.post("/sync", authenticateToken, addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
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
    refreshReferendas(limit, req.daoId).catch(error => {
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
    logger.info({ requestedBy: 'public' }, "Starting cleanup of duplicate team actions");

    const duplicates = await findDuplicateDiscussionActions();
    logger.info({ 
      duplicateCount: duplicates.length,
      duplicates: duplicates.map(d => ({ id: d.id, post_id: d.post_id, title: d.title }))
    }, "Found duplicate 'to_be_discussed' entries");

    const result = await deleteDuplicateDiscussionActions();
    logger.info({ deletedCount: result.changes }, "Cleanup completed successfully");

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
    logger.error({ error: formatError(error) }, "Error during cleanup operation");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * PARAMETERIZED ROUTES - MUST BE LAST!
 * These routes with parameters must come after all specific routes
 * to avoid matching specific paths like "/config" as ":daoId"
 */

/**
 * GET /dao/:daoId
 * Get DAO information (authenticated users only)
 * Returns DAO details without exposing encrypted fields
 */
router.get("/:daoId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const daoId = parseInt(req.params.daoId, 10);
    
    if (isNaN(daoId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid DAO ID'
      });
    }
    
    const daoInfo = await DaoService.getSafeInfo(daoId);
    
    if (!daoInfo) {
      return res.status(404).json({
        success: false,
        error: 'DAO not found'
      });
    }
    
    logger.info({ daoId, requestedBy: req.user?.address }, 'Retrieved DAO info');
    res.json({
      success: true,
      dao: daoInfo
    });
  } catch (error) {
    logger.error({ error: formatError(error), daoId: req.params.daoId }, 'Error retrieving DAO info');
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /dao/:daoId/stats
 * Get DAO statistics (referendum counts, voting activity, etc.)
 */
router.get("/:daoId/stats", authenticateToken, async (req: Request, res: Response) => {
  try {
    const daoId = parseInt(req.params.daoId, 10);
    
    if (isNaN(daoId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid DAO ID'
      });
    }
    
    const stats = await DaoService.getStats(daoId);
    
    logger.info({ daoId, requestedBy: req.user?.address }, 'Retrieved DAO stats');
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error({ error: formatError(error), daoId: req.params.daoId }, 'Error retrieving DAO stats');
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 