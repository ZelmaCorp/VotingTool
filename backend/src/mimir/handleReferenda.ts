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
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Aye
        );
        break;
      case SuggestedVote.Nay:
        logger.info({ postId, network, vote: SuggestedVote.Nay }, "Sending transaction to Mimir (Nay)");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Nay
        );
        break;
      case SuggestedVote.Abstain:
        logger.info({ postId, network, vote: SuggestedVote.Abstain }, "Sending transaction to Mimir (Abstain)");
        ready = await proposeVoteTransaction(
          multisig,
          network,
          postId,
          SuggestedVote.Abstain
        );
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
