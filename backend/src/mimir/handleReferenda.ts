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

/** 
 * Decides whether to send transaction to Mimir with true or false value, abstain will not send transaction.
 * @param referendum - The referendum with details
 * @param network - The network (Polkadot or Kusama)
 * @param postId - The referendum post ID
 * @param multisigAddress - The multisig address to use for voting
 * @param mnemonic - The proposer mnemonic phrase
 */
export async function handleReferendaVote(
  referendum: ReferendumWithDetails,
  network: Chain,
  postId: ReferendumId,
  multisigAddress: string,
  mnemonic: string
): Promise<ReadyProposal | undefined> {
  // Validate inputs
  if (!multisigAddress) {
    logger.error({ postId, network }, "No multisig address provided for voting");
    return undefined;
  }
  
  if (!mnemonic) {
    logger.error({ postId, network }, "No mnemonic provided for voting");
    return undefined;
  }

  if (referendum.internal_status !== InternalStatus.ReadyToVote) {
    return undefined;
  }

  const vote = referendum.suggested_vote;
  if (!vote || ![SuggestedVote.Aye, SuggestedVote.Nay, SuggestedVote.Abstain].includes(vote as SuggestedVote)) {
    logError(logger, { 
      postId, 
      network, 
      suggestedVote: vote 
    }, "No suggested vote found", ErrorType.MISSING_VOTE);
    return undefined;
  }

  // Process the vote
  logger.info({ postId, network, referendumId: referendum.id, vote }, "Sending transaction to Mimir");
  
  const result = await proposeVoteTransaction(
    multisigAddress,
    network,
    postId,
    vote as SuggestedVote,
    mnemonic
  );

  // Save to database
  if (referendum.id && referendum.dao_id) {
    await MimirTransaction.create(referendum.id, referendum.dao_id, result.payload.calldata, result.payload.timestamp);
    logger.info({ referendumId: referendum.id, daoId: referendum.dao_id, postId, vote }, "Saved Mimir transaction to database");
  }

  return result.ready;
}
