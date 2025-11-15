import { handleReferendaVote } from "./handleReferenda";
import { Referendum } from "../database/models/referendum";
import { MimirTransaction } from "../database/models/mimirTransaction";
import { DAO } from "../database/models/dao";
import { createSubsystemLogger, formatError } from "../config/logger";
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
      if (referendum.id && await MimirTransaction.hasPendingTransaction(referendum.id, referendum.dao_id)) {
        logger.info({ postId, network, referendumId: referendum.id }, "Referendum already has pending Mimir transaction, skipping");
        continue;
      }

      // Get DAO context
      if (!referendum.dao_id) {
        logger.error({ postId, network, referendumId: referendum.id }, "Referendum has no DAO assigned, skipping");
        continue;
      }
      
      // Get multisig address and mnemonic for this DAO
      const multisigAddress = await DAO.getDecryptedMultisig(referendum.dao_id, network);
      const mnemonic = await DAO.getDecryptedMnemonic(referendum.dao_id);
      
      if (!multisigAddress) {
        logger.error({ postId, network, daoId: referendum.dao_id }, "DAO has no multisig configured for this network, skipping");
        continue;
      }
      
      if (!mnemonic) {
        logger.error({ postId, network, daoId: referendum.dao_id }, "DAO has no proposer mnemonic configured, skipping");
        continue;
      }

      logger.info({ postId, network, daoId: referendum.dao_id, suggestedVote: referendum.suggested_vote }, "Processing referendum for Mimir");
      
      const promise = handleReferendaVote(referendum, network, postId, multisigAddress, mnemonic);
      mimirPromises.push(promise);
    }

    const results = await Promise.allSettled(mimirPromises);

    // Log results
    let successCount = 0;
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        logger.error({ index, error: formatError(result.reason) }, "Promise failed (rejected)");
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
    logger.error({ error: formatError(error) }, "Error while sending ReadyToVote proposals to Mimir");
    throw error;
  }
}
