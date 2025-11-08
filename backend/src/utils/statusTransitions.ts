import { InternalStatus, Chain, TimelineStatus } from '../types/properties';
import { db } from '../database/connection';
import { getAgreementStats } from './teamActions';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { VOTE_OVER_STATUSES, VOTED_STATUSES } from './constants';

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
      (currentRef.internal_status === InternalStatus.WaitingForAgreement ||
       currentRef.internal_status === InternalStatus.ReadyForApproval) &&
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

/**
 * Processes all pending status transitions for referendums
 * This is a failsafe that checks all referendums that should transition to ReadyToVote
 * or back to WaitingForAgreement based on agreement counts
 * @returns Number of transitions processed
 */
export async function processAllPendingTransitions(): Promise<{ 
  processed: number, 
  transitioned: number,
  details: Array<{ referendumId: number, postId: number, chain: string, oldStatus: string, newStatus: string }>
}> {
  let processed = 0;
  let transitioned = 0;
  const details: Array<{ referendumId: number, postId: number, chain: string, oldStatus: string, newStatus: string }> = [];

  try {
    // Get all referendums that are in WaitingForAgreement or ReadyForApproval
    const referendums = await db.all(
      `SELECT id, post_id, chain, internal_status 
       FROM referendums 
       WHERE internal_status IN (?, ?, ?)`,
      [InternalStatus.WaitingForAgreement, InternalStatus.ReadyForApproval, InternalStatus.ReadyToVote]
    );

    logger.info({ count: referendums.length }, 'Processing pending status transitions');

    for (const ref of referendums) {
      processed++;
      const oldStatus = ref.internal_status;
      
      const { agreementCount, hasVeto, requiredAgreements } = await getAgreementStats(ref.id);

      // Forward transition: WaitingForAgreement/ReadyForApproval -> ReadyToVote
      if (
        (ref.internal_status === InternalStatus.WaitingForAgreement ||
         ref.internal_status === InternalStatus.ReadyForApproval) &&
        !hasVeto &&
        agreementCount >= requiredAgreements
      ) {
        await db.run(
          "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
          [InternalStatus.ReadyToVote, ref.id]
        );
        
        transitioned++;
        details.push({
          referendumId: ref.id,
          postId: ref.post_id,
          chain: ref.chain,
          oldStatus,
          newStatus: InternalStatus.ReadyToVote
        });
        
        logger.info({
          referendumId: ref.id,
          postId: ref.post_id,
          chain: ref.chain,
          agreementCount,
          requiredAgreements,
          oldStatus,
          newStatus: InternalStatus.ReadyToVote
        }, "Processed pending transition to 'Ready to vote'");
      }
      
      // Backward transition: ReadyToVote -> WaitingForAgreement
      else if (
        ref.internal_status === InternalStatus.ReadyToVote &&
        agreementCount < requiredAgreements
      ) {
        await db.run(
          "UPDATE referendums SET internal_status = ?, updated_at = datetime('now') WHERE id = ?",
          [InternalStatus.WaitingForAgreement, ref.id]
        );
        
        transitioned++;
        details.push({
          referendumId: ref.id,
          postId: ref.post_id,
          chain: ref.chain,
          oldStatus,
          newStatus: InternalStatus.WaitingForAgreement
        });
        
        logger.info({
          referendumId: ref.id,
          postId: ref.post_id,
          chain: ref.chain,
          agreementCount,
          requiredAgreements,
          oldStatus,
          newStatus: InternalStatus.WaitingForAgreement
        }, "Processed pending transition back to 'Waiting for agreement'");
      }
    }

    logger.info({ 
      processed, 
      transitioned 
    }, 'Completed processing pending status transitions');

    return { processed, transitioned, details };
  } catch (error) {
    logger.error({ 
      error: formatError(error),
      processed,
      transitioned
    }, "Error processing pending transitions");
    throw error;
  }
}

/**
 * Checks if a timeline status indicates the vote is over
 * @param status The TimelineStatus to check
 * @returns true if the vote is over, false otherwise
 */
export function isVoteOver(status: TimelineStatus | string): boolean {
    return VOTE_OVER_STATUSES.includes(status as TimelineStatus);
}

/**
 * Checks if an internal status indicates the DAO has voted
 * @param status The InternalStatus to check
 * @returns true if the DAO has voted, false otherwise
 */
export function hasVoted(status: InternalStatus | string): boolean {
    return VOTED_STATUSES.includes(status as InternalStatus);
}
