import { InternalStatus, Chain } from '../types/properties';
import { db } from '../database/connection';
import { getAgreementStats } from './teamActions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.APP);

// Define allowed status transitions
const allowedTransitions: Record<InternalStatus, InternalStatus[]> = {
    [InternalStatus.NotStarted]: [InternalStatus.Considering],
    [InternalStatus.Considering]: [InternalStatus.ReadyForApproval],
    [InternalStatus.ReadyForApproval]: [InternalStatus.WaitingForAgreement],
    [InternalStatus.WaitingForAgreement]: [InternalStatus.ReadyToVote],
    [InternalStatus.ReadyToVote]: [InternalStatus.VotedAye, InternalStatus.VotedNay, InternalStatus.VotedAbstain],
    [InternalStatus.Reconsidering]: [InternalStatus.WaitingForAgreement],
    [InternalStatus.VotedAye]: [],
    [InternalStatus.VotedNay]: [],
    [InternalStatus.VotedAbstain]: [],
    [InternalStatus.NotVoted]: []
};

// Special statuses that can be transitioned to from any state
const specialTransitions = [InternalStatus.Reconsidering];

/**
 * Validate if a status transition is allowed
 * @param currentStatus Current status of the referendum
 * @param newStatus Proposed new status
 * @returns true if transition is allowed, false otherwise
 */
export function isValidTransition(currentStatus: InternalStatus, newStatus: InternalStatus): boolean {
    // Allow transition to special statuses from any state
    if (specialTransitions.includes(newStatus)) {
        return true;
    }

    // Get allowed transitions for current status
    const allowed = allowedTransitions[currentStatus] || [];
    return allowed.includes(newStatus);
}

/**
 * Get the next status based on certain conditions
 * @param currentStatus Current status of the referendum
 * @param hasVote Whether a suggested vote exists
 * @param isAssigned Whether the referendum is assigned
 * @returns The next status if conditions are met, or null if no transition needed
 */
export function getNextStatus(
    currentStatus: InternalStatus,
    hasVote: boolean,
    isAssigned: boolean
): InternalStatus | null {
    switch (currentStatus) {
        case InternalStatus.NotStarted:
            return isAssigned ? InternalStatus.Considering : null;
        
        case InternalStatus.Considering:
            return hasVote ? InternalStatus.ReadyForApproval : null;
        
        // Other statuses require manual transitions or specific conditions
        default:
            return null;
    }
}

/**
 * Check if a status can be manually set
 * @param status The status to check
 * @returns true if the status can be manually set, false otherwise
 */
export function canManuallySetStatus(status: InternalStatus): boolean {
    const manuallySettableStatuses = [
        InternalStatus.WaitingForAgreement,
        InternalStatus.Reconsidering
    ];
    return manuallySettableStatuses.includes(status);
}

/**
 * Get error message for invalid transition
 * @param currentStatus Current status of the referendum
 * @param newStatus Attempted new status
 * @returns Error message explaining why the transition is not allowed
 */
export function getTransitionErrorMessage(currentStatus: InternalStatus, newStatus: InternalStatus): string {
    if (newStatus === InternalStatus.NotStarted) {
        return "Cannot transition back to 'Not started' status";
    }

    if ([InternalStatus.ReadyToVote, InternalStatus.VotedAye, InternalStatus.VotedNay, InternalStatus.VotedAbstain].includes(newStatus)) {
        return `Cannot manually set status to '${newStatus}'. This status is set automatically.`;
    }

    const allowed = allowedTransitions[currentStatus] || [];
    if (allowed.length === 0) {
        return `No transitions allowed from '${currentStatus}'`;
    }

    return `Invalid transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(", ")}`;
}

/**
 * Check and apply automatic status transitions based on agreement threshold
 * Handles both forward transition (WaitingForAgreement -> ReadyToVote) 
 * and backward transition (ReadyToVote -> WaitingForAgreement)
 */
export async function checkAndApplyAgreementTransition(
  referendumId: number,
  postId: number,
  chain: Chain
): Promise<void> {
  try {
    const currentRef = await db.get(
      "SELECT id, internal_status FROM referendums WHERE id = ?",
      [referendumId]
    );
    
    if (!currentRef) return;
    
    const { agreementCount, hasVeto, requiredAgreements } = await getAgreementStats(referendumId);
    
    // Transition to ReadyToVote if threshold met
    if (
      currentRef.internal_status === InternalStatus.WaitingForAgreement &&
      !hasVeto &&
      agreementCount >= requiredAgreements
    ) {
      await db.run(
        "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
        [InternalStatus.ReadyToVote, referendumId]
      );
      
      logger.info({
        referendumId,
        postId,
        chain,
        agreementCount,
        requiredAgreements
      }, "Auto-transitioned to 'Ready to vote' after reaching agreement threshold");
    }
    
    // Transition back to WaitingForAgreement if threshold no longer met
    if (
      currentRef.internal_status === InternalStatus.ReadyToVote &&
      agreementCount < requiredAgreements
    ) {
      await db.run(
        "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
        [InternalStatus.WaitingForAgreement, referendumId]
      );
      
      logger.info({
        referendumId,
        postId,
        chain,
        agreementCount,
        requiredAgreements
      }, "Auto-transitioned back to 'Waiting for agreement' after agreement count dropped below threshold");
    }
  } catch (error) {
    logger.error({ 
      error: formatError(error), 
      referendumId, 
      postId, 
      chain 
    }, "Error checking agreement transition");
  }
}
