import { handleReferendaVote } from "./handleReferenda";
import { Referendum } from "../database/models/referendum";
import { MimirTransaction } from "../database/models/mimirTransaction";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.MIMIR);

/**
 * Sends ready proposals to Mimir for batch voting.
 * Reads all referendums from SQLite database, identifies proposals marked as "Ready to vote",
 * and creates voting transactions in Mimir for batch execution.
 */
export async function sendReadyProposalsToMimir(): Promise<void> {
  try {
    logger.info("Sending ReadyToVote proposals to Mimir...");
    const readyReferendums = await Referendum.getReadyToVote();
    const mimirPromises = [];

    logger.info({ count: readyReferendums.length }, "Found referendums ready to vote");

    for (const referendum of readyReferendums) {
      const network = referendum.chain;
      const postId = referendum.post_id;

      // Skip if already has pending Mimir transaction
      if (referendum.id && await MimirTransaction.hasPendingTransaction(referendum.id)) {
        logger.info({ postId, network, referendumId: referendum.id }, "Referendum already has pending Mimir transaction, skipping");
        continue;
      }

      logger.info({ postId, network, suggestedVote: referendum.suggested_vote }, "Processing referendum for Mimir");
      
      const promise = handleReferendaVote(referendum, network, postId);
      mimirPromises.push(promise);
    }

    const results = await Promise.allSettled(mimirPromises);

    // Log results
    let successCount = 0;
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        logger.error({ index, error: result.reason }, "Promise failed (rejected)");
      } else {
        const ready = result.value;
        if (ready) {
          successCount++;
          logger.info({ referendumId: ready.id }, "Successfully processed referendum for Mimir");
        } else {
          logger.warn({ index }, "Promise resolved but returned undefined");
        }
      }
    });

    logger.info({ successCount, totalProcessed: results.length }, "Successfully processed ready proposals");
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error while sending ReadyToVote proposals to Mimir");
    throw error;
  }
}
