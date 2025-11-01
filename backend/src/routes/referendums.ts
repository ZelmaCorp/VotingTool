import { Request, Response, Router } from 'express';
import { Referendum } from '../database/models/referendum';
import { VotingDecision } from '../database/models/votingDecision';
import { Chain, InternalStatus } from '../types/properties';
import { isValidTransition, canManuallySetStatus, getTransitionErrorMessage, checkAndApplyAgreementTransition } from '../utils/statusTransitions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';
import { requireTeamMember } from '../middleware/auth';
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

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Invalid chain. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
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
      await Referendum.update(postId, chain, referendumFields);
    }

    // Handle voting fields update
    if (Object.keys(votingFields).length > 0) {
      await VotingDecision.upsert(referendum.id!, votingFields);
      
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
          referendum.chain
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
router.get("/:postId/actions", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!chain || !Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    }

    const actions = await getReferendumActions(referendum.id!);
    const teamMembers = await multisigService.getCachedTeamMembers();
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
router.post("/:postId/actions", requireTeamMember, async (req: Request, res: Response) => {
  try {
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

    await upsertTeamAction(referendum.id, req.user!.address!, backendAction, reason);
    await checkAndApplyAgreementTransition(referendum.id, postId, chain);

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
router.delete("/:postId/actions", requireTeamMember, async (req: Request, res: Response) => {
  try {
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

    const deleted = await deleteTeamAction(referendum.id, req.user!.address!, backendAction);
    if (!deleted) {
      return errorResponse(res, 404, `No ${action} action found for this user and referendum`);
    }

    await checkAndApplyAgreementTransition(referendum.id, postId, chain);

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
router.post("/:postId/assign", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const referendum = await findReferendum(postId, chain, res);
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

    await handleAssignment(referendum.id, req.user!.address!);
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
router.post("/:postId/unassign", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, unassignNote } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;

    const referendum = await findReferendum(postId, chain, res);
    if (!referendum) return;

    // Check if user is the responsible person
    const assigned = await isUserAssigned(referendum.id, req.user!.address!);
    if (!assigned) {
      return errorResponse(res, 403, "Only the responsible person can unassign themselves");
    }

    await handleUnassignment(referendum.id, req.user!.address!, unassignNote);
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
router.get("/:postId/comments", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.query.chain as Chain;

    if (isNaN(postId)) return errorResponse(res, 400, "Invalid post ID");
    if (!chain || !Object.values(Chain).includes(chain)) {
      return errorResponse(res, 400, "Valid chain parameter is required. Must be 'Polkadot' or 'Kusama'");
    }

    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return errorResponse(res, 404, `Referendum ${postId} not found on ${chain} network`);
    }

    const comments = await getReferendumCommentsFromDb(referendum.id!);
    const teamMembers = await multisigService.getCachedTeamMembers();
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
router.post("/:postId/comments", requireTeamMember, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { chain, content } = req.body;

    if (!validateUser(req.user?.address, res)) return;
    if (!validateChain(chain, res)) return;
    if (!content?.trim()) return errorResponse(res, 400, "Comment content is required");

    const referendum = await findReferendum(postId, chain, res);
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

export default router; 