import { db } from '../database/connection';
import { ReferendumAction } from '../types/auth';
import { multisigService } from '../services/multisig';
import { DAO } from '../database/models/dao';
import { DaoService } from '../services/daoService';
import { Chain } from '../types/properties';

/**
 * Team action utilities
 * Shared functions for handling team actions across routes
 */

/**
 * Map frontend action names to backend enum values
 */
export const ACTION_MAP: Record<string, ReferendumAction> = {
  'agree': ReferendumAction.AGREE,
  'to_be_discussed': ReferendumAction.TO_BE_DISCUSSED,
  'no_way': ReferendumAction.NO_WAY,
  'recuse': ReferendumAction.RECUSE
};

/**
 * Parse and validate action string from frontend
 */
export function parseAction(action: string): ReferendumAction | null {
  return ACTION_MAP[action.toLowerCase()] || null;
}

/**
 * Count agreements and check for vetoes in a referendum
 */
export async function getAgreementStats(referendumId: number, daoId: number, chain: Chain = Chain.Polkadot): Promise<{
  agreementCount: number;
  hasVeto: boolean;
  requiredAgreements: number;
}> {
  // Get the actual multisig threshold (not team size!)
  const info = await DaoService.getMultisigInfo(daoId, chain);
  const requiredAgreements = info?.threshold || 4;
  
  const allActions = await db.all(
    "SELECT team_member_id, role_type FROM referendum_team_roles WHERE referendum_id = ?",
    [referendumId]
  );
  
  // Group actions by member (one action per member)
  const memberStates = new Map<string, string>();
  allActions.forEach(actionItem => {
    if (actionItem.role_type !== ReferendumAction.RESPONSIBLE_PERSON) {
      memberStates.set(actionItem.team_member_id, actionItem.role_type);
    }
  });
  
  // Count agreements and check for vetoes
  let agreementCount = 0;
  let hasVeto = false;
  
  memberStates.forEach((actionState) => {
    if (actionState === ReferendumAction.NO_WAY) {
      hasVeto = true;
    } else if (actionState === ReferendumAction.AGREE) {
      agreementCount++;
    }
  });
  
  return { agreementCount, hasVeto, requiredAgreements };
}

/**
 * Upsert a team action (delete old if exists, insert new)
 * Ensures each team member has only one action state at a time
 */
export async function upsertTeamAction(
  referendumId: number,
  teamMemberId: string,
  action: ReferendumAction,
  daoId: number,
  reason?: string
): Promise<void> {
  const existingAction = await db.get(
    "SELECT id FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type != ? AND dao_id = ?",
    [referendumId, teamMemberId, ReferendumAction.RESPONSIBLE_PERSON, daoId]
  );
  
  if (existingAction) {
    await db.run("DELETE FROM referendum_team_roles WHERE id = ?", [existingAction.id]);
  }
  
  await db.run(
    "INSERT INTO referendum_team_roles (referendum_id, dao_id, team_member_id, role_type, reason) VALUES (?, ?, ?, ?, ?)",
    [referendumId, daoId, teamMemberId, action, reason || null]
  );
}

/**
 * Delete a specific team action
 */
export async function deleteTeamAction(
  referendumId: number,
  teamMemberId: string,
  action: ReferendumAction,
  daoId: number
): Promise<boolean> {
  const result = await db.run(
    "DELETE FROM referendum_team_roles WHERE referendum_id = ? AND team_member_id = ? AND role_type = ? AND dao_id = ?",
    [referendumId, teamMemberId, action, daoId]
  );
  
  return (result.changes ?? 0) > 0;
}

