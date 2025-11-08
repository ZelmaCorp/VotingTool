import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';
import { InternalStatus } from '../types/properties';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { applyStatusTransition } from './statusTransitions';

const logger = createSubsystemLogger(Subsystem.APP);

/**
 * Referendum-specific helper utilities
 */

/**
 * Separate update fields into referendum and voting fields
 */
export function separateUpdateFields(updates: any): {
  referendumFields: any;
  votingFields: any;
} {
  const referendumFields: any = {};
  const votingFields: any = {};

  const referendumColumns = [
    'title', 'description', 'requested_amount_usd', 'origin', 'referendum_timeline',
    'internal_status', 'link', 'voting_start_date', 'voting_end_date',
    'last_edited_by', 'public_comment', 'public_comment_made', 'ai_summary',
    'reason_for_vote', 'reason_for_no_way', 'voted_link'
  ];

  const votingColumns = ['suggested_vote', 'final_vote', 'vote_executed', 'vote_executed_date'];

  Object.keys(updates).forEach(key => {
    if (referendumColumns.includes(key)) {
      referendumFields[key] = updates[key];
    } else if (votingColumns.includes(key)) {
      votingFields[key] = updates[key];
    }
  });

  return { referendumFields, votingFields };
}

/**
 * Check if user is assigned to referendum
 */
export async function isUserAssigned(
  referendumId: number,
  userAddress: string
): Promise<boolean> {
  const assignment = await db.get(
    "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
    [referendumId, userAddress, ReferendumAction.RESPONSIBLE_PERSON]
  );
  return !!assignment;
}

/**
 * Handle suggested vote update (auto-transition + add agree action)
 */
export async function handleSuggestedVoteUpdate(
  referendumId: number,
  userAddress: string,
  currentStatus: InternalStatus,
  postId: number,
  chain: string
): Promise<void> {
  await db.run('BEGIN TRANSACTION');

  try {
    // Auto-transition from Considering to ReadyForApproval
    if (currentStatus === InternalStatus.Considering) {
      await applyStatusTransition(referendumId, InternalStatus.ReadyForApproval);

      logger.info({
        referendumId,
        postId,
        chain,
        oldStatus: InternalStatus.Considering,
        newStatus: InternalStatus.ReadyForApproval
      }, "Auto-transitioned to Ready for approval after setting suggested vote");
    }

    // Remove existing action states (keep RESPONSIBLE_PERSON)
    await db.run(
      "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
      [referendumId, userAddress, ReferendumAction.RESPONSIBLE_PERSON]
    );

    // Add AGREE action for responsible person
    await db.run(
      "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type, created_at) VALUES (?, ?, ?, datetime('now'))",
      [referendumId, userAddress, ReferendumAction.AGREE]
    );

    await db.run('COMMIT');
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

/**
 * Check if assignment already exists
 */
export async function hasExistingAssignment(referendumId: number): Promise<boolean> {
  const existing = await db.get(
    "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND role_type = ?",
    [referendumId, ReferendumAction.RESPONSIBLE_PERSON]
  );
  return !!existing;
}

/**
 * Assign user as responsible person
 */
export async function assignResponsiblePerson(
  referendumId: number,
  userAddress: string
): Promise<void> {
  await db.run(
    "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES (?, ?, ?)",
    [referendumId, userAddress, ReferendumAction.RESPONSIBLE_PERSON]
  );
}

/**
 * Remove responsible person assignment
 */
export async function removeResponsiblePerson(
  referendumId: number,
  userAddress: string
): Promise<boolean> {
  const result = await db.run(
    "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ?",
    [referendumId, userAddress, ReferendumAction.RESPONSIBLE_PERSON]
  );
  return (result.changes ?? 0) > 0;
}

/**
 * Clear suggested vote and related data
 */
export async function clearSuggestedVote(referendumId: number): Promise<void> {
  await db.run(
    "UPDATE voting_decisions SET suggested_vote = NULL WHERE referendum_id = ?",
    [referendumId]
  );
}

/**
 * Clear all team actions for a referendum
 */
export async function clearAllTeamActions(referendumId: number): Promise<void> {
  await db.run(
    "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND role_type != ?",
    [referendumId, ReferendumAction.RESPONSIBLE_PERSON]
  );
}

/**
 * Enrich actions with team member information
 */
export function enrichActionsWithMemberInfo(
  actions: any[],
  teamMembers: any[]
): any[] {
  return actions.map(action => {
    const member = teamMembers.find((m: { wallet_address: string }) => 
      m.wallet_address === action.team_member_id
    );
    return {
      ...action,
      team_member_name: member?.team_member_name || `Multisig Member`,
      wallet_address: action.team_member_id,
      network: member?.network || "Unknown"
    };
  });
}

/**
 * Get referendum actions from database
 */
export async function getReferendumActions(referendumId: number): Promise<any[]> {
  return await db.all(`
    SELECT rtr.*
    FROM referendum_team_roles rtr
    WHERE rtr.referendum_id = ?
    ORDER BY rtr.created_at DESC
  `, [referendumId]);
}

/**
 * Handle complete unassignment process
 */
export async function handleUnassignment(
  referendumId: number,
  userAddress: string,
  unassignNote?: string
): Promise<void> {
  await db.run('BEGIN TRANSACTION');

  try {
    // Get current voting decision before removing role
    const votingDecision = await db.get(
      "SELECT suggested_vote FROM voting_decisions WHERE referendum_id = ?",
      [referendumId]
    );
    const previousVote = votingDecision?.suggested_vote;

    // Remove responsible person role AND any team actions (except NO WAY)
    await db.run(
      "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ?",
      [referendumId, userAddress, ReferendumAction.NO_WAY]
    );

    // Reset suggested vote
    await db.run(
      "UPDATE voting_decisions SET suggested_vote = NULL WHERE referendum_id = ?",
      [referendumId]
    );

    // Reset internal status and clear reason for vote
    await db.run(
      "UPDATE referendums SET internal_status = ?, updated_at = datetime('now'), reason_for_vote = NULL WHERE id = ?",
      [InternalStatus.NotStarted, referendumId]
    );

    // Add unassign message with optional note and previous vote
    const noteLines = ['[UNASSIGN MESSAGE]'];
    if (previousVote) noteLines.push(`Previous vote: ${previousVote}`);
    if (unassignNote?.trim()) noteLines.push(`Note: ${unassignNote.trim()}`);

    await db.run(
      "INSERT INTO referendum_comments (referendum_id, team_member_id, content) VALUES (?, ?, ?)",
      [referendumId, userAddress, noteLines.join('\n')]
    );

    await db.run('COMMIT');
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

/**
 * Handle assignment with status transition
 */
export async function handleAssignment(
  referendumId: number,
  userAddress: string
): Promise<void> {
  await db.run('BEGIN TRANSACTION');

  try {
    await assignResponsiblePerson(referendumId, userAddress);

    // Update referendum status to Considering if it's not already in a later stage
    await db.run(
      "UPDATE referendums SET internal_status = CASE WHEN internal_status = ? THEN ? ELSE internal_status END, updated_at = datetime('now') WHERE id = ?",
      [InternalStatus.NotStarted, InternalStatus.Considering, referendumId]
    );

    await db.run('COMMIT');
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

