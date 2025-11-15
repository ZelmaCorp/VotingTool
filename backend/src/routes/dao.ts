import { Router, Request, Response } from "express";
import { db } from "../database/connection";
import { requireTeamMember, authenticateToken, addDaoContext, requireDaoMembership } from "../middleware/auth";
import { ReferendumAction } from "../types/auth";
import { InternalStatus, Chain } from "../types/properties";
import { multisigService } from "../services/multisig";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { refreshReferendas } from "../refresh";
import { DAO } from "../database/models/dao";

const router = Router();
const logger = createSubsystemLogger(Subsystem.APP);

import { signatureVerify } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';

/**
 * Helper: Generate a BIP39 mnemonic phrase (24 words)
 */
const generateMnemonic = (): string => {
  const { mnemonicGenerate } = require('@polkadot/util-crypto');
  return mnemonicGenerate(24);
};

/**
 * Helper: Verify wallet signature
 */
const verifySignature = (address: string, message: string, signature: string): boolean => {
  try {
    const signatureU8a = hexToU8a(signature);
    const result = signatureVerify(message, signatureU8a, address);
    return result.isValid;
  } catch (error) {
    logger.error({ error: formatError(error), address }, 'Signature verification failed');
    return false;
  }
};

/**
 * Helper: Validate registration input
 */
const validateRegistrationInput = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('DAO name is required');
  }
  if (data.name && data.name.length > 100) {
    errors.push('DAO name must be less than 100 characters');
  }
  if (!data.polkadotMultisig && !data.kusamaMultisig) {
    errors.push('At least one multisig address (Polkadot or Kusama) is required');
  }
  if (!data.walletAddress || typeof data.walletAddress !== 'string') {
    errors.push('Wallet address is required');
  }
  if (!data.signature || typeof data.signature !== 'string') {
    errors.push('Signature is required for verification');
  }
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required for verification');
  }
  
  return errors;
};

/**
 * Helper: Verify multisig and membership on-chain
 */
const verifyMultisigMembership = async (
  multisigAddress: string | null, 
  walletAddress: string, 
  chain: Chain
): Promise<{ isVerified: boolean; error?: string }> => {
  if (!multisigAddress) {
    return { isVerified: false };
  }
  
  try {
    const multisigInfo = await multisigService.getMultisigInfo(multisigAddress, chain);
    if (!multisigInfo || !multisigInfo.members || multisigInfo.members.length === 0) {
      return { isVerified: false, error: `${chain} multisig address not found on-chain or has no members` };
    }
    
    const isMember = await multisigService.isTeamMember(walletAddress, multisigAddress, chain);
    if (!isMember) {
      return { isVerified: false, error: `Your wallet address is not a member of the ${chain} multisig` };
    }
    
    return { isVerified: true };
  } catch (error) {
    logger.error({ error: formatError(error), multisig: multisigAddress, chain }, 'Error verifying multisig');
    return { isVerified: false, error: `Failed to verify ${chain} multisig on-chain. Please check the address.` };
  }
};

/**
 * Helper: Verify all multisigs and return verified chains
 */
const performMultisigVerifications = async (
  polkadotMultisig: string | null,
  kusamaMultisig: string | null,
  walletAddress: string
): Promise<{ success: boolean; chains?: Chain[]; errors?: string[] }> => {
  const verificationResults = await Promise.all([
    verifyMultisigMembership(polkadotMultisig, walletAddress, Chain.Polkadot),
    verifyMultisigMembership(kusamaMultisig, walletAddress, Chain.Kusama)
  ]);
  
  const errors = verificationResults.filter(r => r.error).map(r => r.error!);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const chains = verificationResults
    .map((r, i) => r.isVerified ? (i === 0 ? Chain.Polkadot : Chain.Kusama) : null)
    .filter(Boolean) as Chain[];
  
  if (chains.length === 0) {
    return { success: false, errors: ['You must be a member of at least one of the provided multisigs'] };
  }
  
  return { success: true, chains };
};

/**
 * Helper: Create DAO from registration data
 */
const createDaoFromRegistration = async (
  name: string,
  description: string | undefined,
  polkadotMultisig: string | null,
  kusamaMultisig: string | null
): Promise<number> => {
  return await DAO.create({
    name: name.trim(),
    description: description?.trim() || undefined,
    polkadot_multisig: polkadotMultisig || undefined,
    kusama_multisig: kusamaMultisig || undefined,
    proposer_mnemonic: generateMnemonic(),
    status: 'active'
  });
};

/**
 * Helper: Get default chain from query or default to Polkadot
 * In the future, this could be enhanced to remember user's last selected chain
 */
const getChainFromQuery = (query: any): Chain => {
  const chain = query.chain as string;
  return chain && Object.values(Chain).includes(chain as Chain) 
    ? (chain as Chain) 
    : Chain.Polkadot;
};

/**
 * Helper: Get team members with their formatted info
 */
const getTeamMembersInfo = async (daoId: number, chain: Chain) => {
  const members = await DAO.getMembers(daoId, chain);
  return members.map(member => ({
    address: member.wallet_address,
    name: member.team_member_name || `Multisig Member (${member.network})`,
    network: member.network
  }));
};

/**
 * Helper: Get action checkers for workflow categorization
 */
const createActionCheckers = (actionsByReferendum: Map<number, any[]>, teamMembers: any[]) => ({
  hasVeto: (refId: number) => {
    const actions = actionsByReferendum.get(refId) || [];
    return actions.some(a => a.role_type === ReferendumAction.NO_WAY);
  },
  hasDiscussionFlag: (refId: number) => {
    const actions = actionsByReferendum.get(refId) || [];
    return actions.some(a => a.role_type === ReferendumAction.TO_BE_DISCUSSED);
  },
  countAgreeActions: (refId: number) => {
    const actions = actionsByReferendum.get(refId) || [];
    return actions.filter(a => a.role_type === ReferendumAction.AGREE).length;
  },
  getVetoInfo: (refId: number) => {
    const actions = actionsByReferendum.get(refId) || [];
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
  }
});

/**
 * Helper: Categorize referendums into workflow categories
 */
const categorizeReferendums = (
  referendums: any[], 
  checkers: ReturnType<typeof createActionCheckers>,
  totalTeamMembers: number
) => {
  const needsAgreement: any[] = [];
  const readyToVote: any[] = [];
  const forDiscussion: any[] = [];
  const vetoedProposals: any[] = [];

  referendums.forEach((ref: any) => {
    const refId = ref.id;
    const agreeCount = checkers.countAgreeActions(refId);
    
    ref.agreement_count = agreeCount;
    ref.required_agreements = totalTeamMembers;

    if (checkers.hasVeto(refId)) {
      const vetoInfo = checkers.getVetoInfo(refId);
      vetoedProposals.push({ ...ref, ...vetoInfo });
    } else if (ref.internal_status === InternalStatus.ReadyToVote) {
      readyToVote.push(ref);
    } else if (ref.internal_status.startsWith('Voted')) {
      // Skip voted referendums
    } else if (
      (ref.internal_status === InternalStatus.WaitingForAgreement ||
       ref.internal_status === InternalStatus.ReadyForApproval) &&
      agreeCount < totalTeamMembers
    ) {
      needsAgreement.push(ref);
    } else if (checkers.hasDiscussionFlag(refId) && agreeCount === 0) {
      forDiscussion.push(ref);
    }
  });

  return { needsAgreement, readyToVote, forDiscussion, vetoedProposals };
};

/**
 * Helper: Find duplicate "to_be_discussed" actions
 */
const findDuplicateDiscussionActions = async () => {
  return await db.all(`
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
};

/**
 * Helper: Delete duplicate "to_be_discussed" actions
 */
const deleteDuplicateDiscussionActions = async () => {
  return await db.run(`
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
};

/**
 * Helper: Add team actions to proposals
 */
const addTeamActionsToProposals = async (proposals: any[], teamMembers: any[]) => {
  for (const proposal of proposals) {
    const actions = await db.all(`
      SELECT team_member_id, role_type, reason, created_at
      FROM referendum_team_roles
      WHERE referendum_id = ?
    `, [proposal.id]);

    const roleAssignments = new Map<string, any>();
    const actionStates = new Map<string, any>();
    const memberActions = new Map<string, { action: any, timestamp: Date }[]>();
    
    actions.forEach((action: any) => {
      const member = multisigService.findMemberByAddress(teamMembers, action.team_member_id);
      const canonicalAddress = member?.wallet_address || action.team_member_id;
      
      const actionData = {
        team_member_id: canonicalAddress,
        wallet_address: canonicalAddress,
        role_type: action.role_type,
        reason: action.reason,
        created_at: action.created_at,
        team_member_name: member?.team_member_name || 'Unknown Member'
      };
      
      const existing = memberActions.get(canonicalAddress) || [];
      existing.push({ action: actionData, timestamp: new Date(action.created_at) });
      memberActions.set(canonicalAddress, existing);
    });
    
    memberActions.forEach((memberActionList, canonicalAddress) => {
      memberActionList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      const roleAction = memberActionList.find(a => a.action.role_type === ReferendumAction.RESPONSIBLE_PERSON);
      if (roleAction) roleAssignments.set(canonicalAddress, roleAction.action);
      
      const latestActionState = memberActionList.find(a => a.action.role_type !== ReferendumAction.RESPONSIBLE_PERSON);
      if (latestActionState) actionStates.set(canonicalAddress, latestActionState.action);
    });

    proposal.role_assignments = Array.from(roleAssignments.values());
    proposal.team_actions = Array.from(actionStates.values());
    
    const responsiblePerson = Array.from(roleAssignments.values()).find(
      (ra: any) => ra.role_type === ReferendumAction.RESPONSIBLE_PERSON
    );
    proposal.assigned_to = responsiblePerson?.wallet_address || null;
  }
};

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
    const members = await getTeamMembersInfo(req.daoId!, chain);
    
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
    const info = await DAO.getMultisigInfo(daoId, chain);
    const teamMembers = await getTeamMembersInfo(daoId, chain);
    
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
    const teamMembers = await DAO.getMembers(daoId, chain);
    const totalTeamMembers = teamMembers.length;

    // Get all referendums and actions
    const allReferendums = await db.all(`SELECT r.* FROM referendums r ORDER BY r.created_at DESC`);
    const allActions = await db.all(`
      SELECT referendum_id, team_member_id, role_type, reason, created_at
      FROM referendum_team_roles
    `);

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

export default router; 