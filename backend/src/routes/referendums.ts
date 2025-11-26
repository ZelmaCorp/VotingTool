import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { DAO } from '../database/models/dao';
import { DaoService } from '../services/daoService';
import { Chain, InternalStatus } from '../types/properties';
import { isValidTransition, canManuallySetStatus, getTransitionErrorMessage, checkAndApplyAgreementTransition } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';
import { requireTeamMember, addDaoContext, requireDaoMembership } from '../middleware/auth';
import { multisigService } from '../services/multisig';
import { ACTION_MAP, parseAction, upsertTeamAction, deleteTeamAction } from '../utils/teamActions';
import { errorResponse, successResponse, validateUser, validateChain, findReferendum } from '../utils/routeHelpers';
import { 
  separateUpdateFields, 
  isUserAssigned, 
  handleSuggestedVoteUpdate,
  enrichActionsWithMemberInfo,
  getReferendumActions,
  handleAssignment,
  handleUnassignment
} from '../utils/referendumHelpers';
import { 
  enrichComments,
  getReferendumCommentsFromDb,
  createReferendumComment,
  getReferendumComment,
  deleteReferendumComment,
  isCommentAuthor 
} from '../utils/commentHelpers';

const logger = createSubsystemLogger(Subsystem.APP);
const router = Router();

/**
 * Helper: Process member actions into agreement summary categories
 */
const processMemberActionsForSummary = (
  allMembers: Array<{ address: string; name: string }>,
  actionsByMember: Map<string, any[]>,
  teamMembers: any[],
  chain: Chain
) => {
  const agreed: any[] = [];
  const pending: any[] = [];
  const recused: any[] = [];
  const toBeDiscussed: any[] = [];
  let vetoed = false;
  let vetoBy: string | null = null;
  let vetoReason: string | null = null;

  allMembers.forEach(member => {
    let memberActions = actionsByMember.get(member.address);
    
    // Try flexible address matching if not found
    if (!memberActions) {
      for (const [actionAddress, actionsData] of actionsByMember.entries()) {
        const matchingMember = multisigService.findMemberByAddress(teamMembers, actionAddress, chain as "Polkadot" | "Kusama");
        if (matchingMember?.wallet_address === member.address) {
          memberActions = actionsData;
          break;
        }
      }
    }
    
    const actionStates = memberActions?.filter(a => a.role_type !== ReferendumAction.RESPONSIBLE_PERSON) || [];
    
    if (actionStates.length === 0) {
      pending.push(member);
    } else {
      const hasNoWay = actionStates.some(a => a.role_type === ReferendumAction.NO_WAY);
      const hasAgree = actionStates.some(a => a.role_type === ReferendumAction.AGREE);
      const hasRecuse = actionStates.some(a => a.role_type === ReferendumAction.RECUSE);
      const hasToBeDiscussed = actionStates.some(a => a.role_type === ReferendumAction.TO_BE_DISCUSSED);
      
      if (hasNoWay) {
        const noWayAction = actionStates.find(a => a.role_type === ReferendumAction.NO_WAY);
        vetoed = true;
        vetoBy = member.name;
        vetoReason = noWayAction?.reason || null;
      } else if (hasAgree) {
        agreed.push(member);
      } else if (hasRecuse) {
        recused.push(member);
      } else if (hasToBeDiscussed) {
        toBeDiscussed.push(member);
      } else {
        pending.push(member);
      }
    }
  });

  return {
    agreed_members: agreed,
    pending_members: pending,
    recused_members: recused,
    to_be_discussed_members: toBeDiscussed,
    vetoed,
    veto_by: vetoBy,
    veto_reason: vetoReason
  };
};

// Get all referendums from the database
router.get("/", addDaoContext, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ 
        path: req.path,
        method: req.method,
        userAddress: req.user?.address,
        isAuthenticated: req.isAuthenticated,
        hasMultisigHeader: !!req.headers['x-multisig-address'],
        multisigHeader: req.headers['x-multisig-address']
      }, "DAO context could not be determined for GET /referendums");
      
      return res.status(400).json({
        success: false,
        error: 'DAO context could not be determined. Please ensure your wallet is registered in a DAO.'
      });
    }
    
    const referendums = await Referendum.getAll(req.daoId);
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
router.get("/:postId", addDaoContext, async (req: Request, res: Response) => {
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

    if (!req.daoId) {
      logger.error({ 
        path: req.path,
        method: req.method,
        postId,
        chain,
        userAddress: req.user?.address,
        isAuthenticated: req.isAuthenticated,
        hasMultisigHeader: !!req.headers['x-multisig-address'],
        multisigHeader: req.headers['x-multisig-address']
      }, `DAO context could not be determined for GET /referendums/${postId}`);
      
      return res.status(400).json({
        success: false,
        error: 'DAO context could not be determined. Please ensure your wallet is registered in a DAO.'
      });
    }

    // Find the referendum
    const referendum = await Referendum.findByPostIdAndChain(postId, chain, req.daoId);
    
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
router.put("/:postId/:chain", addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'PUT /referendums/:postId/:chain' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const chain = req.params.chain as Chain;
    const updates = req.body;

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Invalid chain. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain, req.daoId);
    if (!referendum) return errorResponse(res, 404, "Referendum not found");

    const { referendumFields, votingFields } = separateUpdateFields(updates);

    // Handle referendum fields update
    if (Object.keys(referendumFields).length > 0) {
      if (referendumFields.internal_status) {
        const newStatus = referendumFields.internal_status as InternalStatus;
        const assigned = await isUserAssigned(referendum.id!, req.user?.address || '');

        if (!assigned && !canManuallySetStatus(newStatus)) {
          return errorResponse(res, 403, "Only the assigned user can change the status");
        }

        if (!isValidTransition(referendum.internal_status as InternalStatus, newStatus)) {
          return errorResponse(res, 400, getTransitionErrorMessage(referendum.internal_status as InternalStatus, newStatus));
        }
      }
      await Referendum.update(postId, chain, req.daoId, referendumFields);
    }

    // Handle voting fields update
    if (Object.keys(votingFields).length > 0) {
      await VotingDecision.upsert(referendum.id!, req.daoId, votingFields);
      
      if (votingFields.suggested_vote && req.user?.address) {
        const assigned = await isUserAssigned(referendum.id!, req.user.address);
        if (!assigned) {
          return errorResponse(res, 403, "Only the assigned responsible person can set a suggested vote");
        }

        await handleSuggestedVoteUpdate(
          referendum.id!,
          req.user.address,
          referendum.internal_status as InternalStatus,
          referendum.post_id,
          referendum.chain,
          req.daoId
        );
      }
    }

    return successResponse(res, { message: "Referendum updated successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId, chain: req.params.chain }, "Error updating referendum");
    return errorResponse(res, 500, "Error updating referendum: " + formatError(error));
  }
});

/**
 * GET /referendums/:postId/actions
 * Get team actions for a specific referendum
 */
router.get("/:postId/actions", addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'GET /referendums/:postId/actions' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!chain || !Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain, req.daoId);
    if (!referendum) {
      return errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    }

    const actions = await getReferendumActions(referendum.id!);
    const daoId = req.daoId;
    const teamMembers = await DaoService.getMembers(daoId, chain);
    const enrichedActions = enrichActionsWithMemberInfo(actions, teamMembers);

    return successResponse(res, { actions: enrichedActions });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error retrieving team actions");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * POST /referendums/:postId/actions
 * Add a team action to a referendum
 */
router.post("/:postId/actions", addDaoContext, requireDaoMembership, requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'POST /referendums/:postId/actions' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const { chain, action, reason } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const backendAction = parseAction(action);
    if (!backendAction) {
      return errorResponse(res, 400, `Valid action is required. Valid actions: ${Object.keys(ACTION_MAP).join(', ')}`);
    }

    const referendum = await findReferendum(postId, chain, res);
    if (!referendum) return;

    await upsertTeamAction(referendum.id, req.user!.address!, backendAction, req.daoId, reason);
    await checkAndApplyAgreementTransition(referendum.id, postId, chain, req.daoId);

    return successResponse(res, { message: "Team action added successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error adding team action");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * DELETE /referendums/:postId/actions
 * Delete a team action from a referendum
 */
router.delete("/:postId/actions", addDaoContext, requireDaoMembership, requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'DELETE /referendums/:postId/actions' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const { chain, action } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const backendAction = parseAction(action);
    if (!backendAction) {
      return errorResponse(res, 400, `Valid action type is required. Valid actions: ${Object.keys(ACTION_MAP).join(', ')}`);
    }

    const referendum = await findReferendum(postId, chain, res);
    if (!referendum) return;

    const deleted = await deleteTeamAction(referendum.id, req.user!.address!, backendAction, req.daoId);
    if (!deleted) {
      return errorResponse(res, 404, `No ${action} action found for this user and referendum`);
    }

    await checkAndApplyAgreementTransition(referendum.id, postId, chain, req.daoId);

    return successResponse(res, { message: "Team action removed successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error removing team action");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * POST /referendums/:postId/assign
 * Assign the current user as the responsible person for a referendum
 */
router.post("/:postId/assign", addDaoContext, requireDaoMembership, requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'POST /referendums/:postId/assign' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const { chain } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const referendum = await findReferendum(postId, chain, res, req.daoId);
    if (!referendum) return;

    // Check if already assigned
    const existing = await db.get(
      "SELECT team_member_id FROM referendum_team_roles WHERE referendum_id = ? AND role_type = ?",
      [referendum.id, ReferendumAction.RESPONSIBLE_PERSON]
    );

    if (existing) {
      if (existing.team_member_id === req.user!.address) {
        return successResponse(res, { message: "Already assigned to you" });
      }
      return errorResponse(res, 400, "This proposal is already assigned to another team member");
    }

    await handleAssignment(referendum.id, req.user!.address!, req.daoId);
    return successResponse(res, { message: "Assigned successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error assigning to referendum");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * POST /referendums/:postId/unassign
 * Unassign the responsible person from a referendum and reset its state
 */
router.post("/:postId/unassign", addDaoContext, requireDaoMembership, requireTeamMember, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'POST /referendums/:postId/unassign' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const { chain, unassignNote } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const referendum = await findReferendum(postId, chain, res, req.daoId);
    if (!referendum) return;

    // Check if user is the responsible person
    const assigned = await isUserAssigned(referendum.id, req.user!.address!);
    if (!assigned) {
      return errorResponse(res, 403, "Only the responsible person can unassign themselves");
    }

    await handleUnassignment(referendum.id, req.user!.address!, req.daoId, unassignNote);
    return successResponse(res, { message: "Unassigned successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error unassigning from referendum");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * GET /referendums/:postId/comments
 * Get comments for a specific referendum
 */
router.get("/:postId/comments", addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'GET /referendums/:postId/comments' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!chain || !Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain, req.daoId);
    if (!referendum) {
      return errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    }

    const comments = await getReferendumCommentsFromDb(referendum.id!);
    const daoId = req.daoId;
    const teamMembers = await DaoService.getMembers(daoId, chain);
    const enrichedComments = enrichComments(comments, teamMembers);

    return successResponse(res, { comments: enrichedComments });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error fetching comments");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * POST /referendums/:postId/comments
 * Add a comment to a specific referendum
 */
router.post("/:postId/comments", addDaoContext, requireDaoMembership, requireTeamMember, async (req: Request, res: Response) => {
  try {
    // Debug logging for DAO context
    if (!req.daoId) {
      logger.error({ 
        user: req.user?.address,
        isAuthenticated: req.isAuthenticated,
        path: req.path,
        method: req.method
      }, "DAO context missing when trying to add comment");
      return errorResponse(res, 403, "DAO context could not be determined. Please try refreshing the page.");
    }

    const postId = parseInt(req.params.postId);
    const { chain, content } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;
    if (!content?.trim()) return errorResponse(res, 400, "Comment content is required");

    const referendum = await findReferendum(postId, chain, res, req.daoId);
    if (!referendum) return;

    const commentId = await createReferendumComment(referendum.id, req.user!.address!, content);

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: {
        id: commentId,
        content: content.trim(),
        user_address: req.user!.address,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error adding comment");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * DELETE /comments/:commentId
 * Delete a specific comment (only by the author)
 */
router.delete("/comments/:commentId", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (!validateUser(req.user?.address, res)) return;

    const comment = await getReferendumComment(commentId);
    if (!comment) return errorResponse(res, 404, "Comment not found");

    if (!isCommentAuthor(comment, req.user!.address!)) {
      return errorResponse(res, 403, "You can only delete your own comments");
    }

    const deleted = await deleteReferendumComment(commentId);
    if (!deleted) return errorResponse(res, 404, "Comment not found or already deleted");

    return successResponse(res, { message: "Comment deleted successfully" });
  } catch (error) {
    logger.error({ error: formatError(error), commentId: req.params.commentId }, "Error deleting comment");
    return errorResponse(res, 500, "Internal server error");
  }
});

/**
 * GET /referendums/:postId/agreement-summary
 * Get agreement summary for a specific referendum during discussion period
 */
router.get("/:postId/agreement-summary", addDaoContext, requireDaoMembership, async (req: Request, res: Response) => {
  try {
    if (!req.daoId) {
      logger.error({ path: req.path, operation: 'GET /referendums/:postId/agreement-summary' }, "DAO context missing");
      return errorResponse(res, 400, 'DAO context could not be determined');
    }

    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;
    
    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!chain || !Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'");
    }
    
    const referendum = await Referendum.findByPostIdAndChain(postId, chain, req.daoId);
    if (!referendum) {
      return errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    }
    
    const actions = await db.all(`
      SELECT team_member_id as wallet_address, role_type, reason, created_at
      FROM referendum_team_roles
      WHERE referendum_id = ?
      ORDER BY created_at DESC
    `, [referendum.id]);
    
    const daoId = req.daoId;
    const teamMembers = await DaoService.getMembers(daoId, chain);
    const multisigInfo = await DaoService.getMultisigInfo(daoId, chain);
    
    const allMembers = teamMembers.map(member => ({
      address: member.wallet_address,
      name: member.team_member_name || `Multisig Member (${member.network})`
    }));
    
    const actionsByMember = new Map<string, any[]>();
    actions.forEach(action => {
      const existing = actionsByMember.get(action.wallet_address) || [];
      existing.push(action);
      actionsByMember.set(action.wallet_address, existing);
    });
    
    const processedActions = processMemberActionsForSummary(allMembers, actionsByMember, teamMembers, chain);
    
    const summary = {
      total_agreements: processedActions.agreed_members.length,
      required_agreements: multisigInfo?.threshold || 4,
      ...processedActions
    };
    
    return successResponse(res, { summary });
  } catch (error) {
    logger.error({ error: formatError(error), postId: req.params.postId }, "Error fetching agreement summary");
    return errorResponse(res, 500, "Internal server error");
  }
});

export default router; 