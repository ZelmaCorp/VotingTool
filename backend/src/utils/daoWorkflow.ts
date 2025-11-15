import { db } from '../database/connection';
import { DAO } from '../database/models/dao';
import { multisigService } from '../services/multisig';
import { Chain, InternalStatus } from '../types/properties';
import { ReferendumAction } from '../types/auth';

/**
 * Get default chain from query or default to Polkadot
 */
export const getChainFromQuery = (query: any): Chain => {
  const chain = query.chain as string;
  return chain && Object.values(Chain).includes(chain as Chain) 
    ? (chain as Chain) 
    : Chain.Polkadot;
};

/**
 * Get team members with their formatted info
 */
export const getTeamMembersInfo = async (daoId: number, chain: Chain) => {
  const members = await DAO.getMembers(daoId, chain);
  return members.map(member => ({
    address: member.wallet_address,
    name: member.team_member_name || `Multisig Member (${member.network})`,
    network: member.network
  }));
};

/**
 * Get action checkers for workflow categorization
 */
export const createActionCheckers = (actionsByReferendum: Map<number, any[]>, teamMembers: any[]) => ({
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
 * Categorize referendums into workflow categories
 */
export const categorizeReferendums = (
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
 * Find duplicate "to_be_discussed" actions
 */
export const findDuplicateDiscussionActions = async () => {
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
 * Delete duplicate "to_be_discussed" actions
 */
export const deleteDuplicateDiscussionActions = async () => {
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
 * Add team actions to proposals
 */
export const addTeamActionsToProposals = async (proposals: any[], teamMembers: any[]) => {
  for (const proposal of proposals) {
    const actions = await db.all(`
      SELECT team_member_id, role_type, reason, created_at
      FROM referendum_team_roles
      WHERE referendum_id = ?
    `, [proposal.id]);

    const roleAssignments = new Map<string, any>();
    const actionStates = new Map<string, any>();

    actions.forEach((action: any) => {
      const actionKey = `${action.team_member_id}_${action.role_type}`;
      
      if (action.role_type === ReferendumAction.RESPONSIBLE_PERSON) {
        if (!roleAssignments.has(actionKey)) {
          roleAssignments.set(actionKey, {
            wallet_address: action.team_member_id,
            role_type: action.role_type,
            assigned_at: action.created_at
          });
        }
      } else {
        if (!actionStates.has(actionKey)) {
          actionStates.set(actionKey, {
            wallet_address: action.team_member_id,
            action: action.role_type,
            reason: action.reason,
            created_at: action.created_at
          });
        }
      }
    });

    proposal.role_assignments = Array.from(roleAssignments.values());
    proposal.team_actions = Array.from(actionStates.values());
    
    const responsiblePerson = Array.from(roleAssignments.values()).find(
      (ra: any) => ra.role_type === ReferendumAction.RESPONSIBLE_PERSON
    );
    proposal.assigned_to = responsiblePerson?.wallet_address || null;
  }
};

