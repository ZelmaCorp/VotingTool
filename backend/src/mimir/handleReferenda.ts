import { ReadyProposal } from "../types/mimir";
import { ReferendumWithDetails } from "../database/types";
import {
  Chain,
  InternalStatus,
  ReferendumId,
  SuggestedVote,
} from "../types/properties";
import { proposeVoteTransaction } from "./proposeVote";
import { createSubsystemLogger, logError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";
import { MimirTransaction } from "../database/models/mimirTransaction";

const logger = createSubsystemLogger(Subsystem.MIMIR);

/** Decides whether to send transaction to Mimir with true or false value, abstain will not send transaction. */
export async function handleReferendaVote(
  referendum: ReferendumWithDetails,
  network: Chain,
  postId: ReferendumId
): Promise<ReadyProposal | undefined> {
  let multisig: string = "";
  if (network === Chain.Polkadot) {
    multisig = process.env.POLKADOT_MULTISIG || "";
  }
  if (network === Chain.Kusama) {
    multisig = process.env.KUSAMA_MULTISIG || "";
  }

  if (referendum.internal_status === InternalStatus.ReadyToVote) {
    logger.info({ postId, network, referendumId: referendum.id }, "Proposal is in ReadyToVote status");
    let ready: ReadyProposal | undefined = undefined;
    switch (referendum.suggested_vote) {
      case SuggestedVote.Aye:
        logger.info({ postId, network, vote: SuggestedVote.Aye }, "Sending transaction to Mimir (Aye)");
        const ayeResult = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Aye
        );
        ready = ayeResult.ready;
        // Save to database
        if (referendum.id) {
          await MimirTransaction.create(referendum.id, ayeResult.payload.calldata, ayeResult.payload.timestamp);
          logger.info({ referendumId: referendum.id, postId }, "Saved Mimir transaction to database");
        }
        break;
      case SuggestedVote.Nay:
        logger.info({ postId, network, vote: SuggestedVote.Nay }, "Sending transaction to Mimir (Nay)");
        const nayResult = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Nay
        );
        ready = nayResult.ready;
        // Save to database
        if (referendum.id) {
          await MimirTransaction.create(referendum.id, nayResult.payload.calldata, nayResult.payload.timestamp);
          logger.info({ referendumId: referendum.id, postId }, "Saved Mimir transaction to database");
        }
        break;
      case SuggestedVote.Abstain:
        logger.info({ postId, network, vote: SuggestedVote.Abstain }, "Sending transaction to Mimir (Abstain)");
        const abstainResult = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Abstain
        );
        ready = abstainResult.ready;
        // Save to database
        if (referendum.id) {
          await MimirTransaction.create(referendum.id, abstainResult.payload.calldata, abstainResult.payload.timestamp);
          logger.info({ referendumId: referendum.id, postId }, "Saved Mimir transaction to database");
        }
        break;
      default:
        logError(logger, { 
          postId, 
          network, 
          suggestedVote: referendum.suggested_vote 
        }, "No suggested vote found", ErrorType.MISSING_VOTE);
    }

    if (ready) {
      return ready;
    } else {
      return undefined;
    }
  }
}
