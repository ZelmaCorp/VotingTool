import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  KUSAMA_PROVIDER,
  POLKADOT_PROVIDER,
  SUBSCAN_ROW_COUNT,
  TRACKS,
  MIMIR_TRANSACTION_CLEANUP_DAYS,
} from "../utils/constants";
import {
  Chain,
  ExtrinsicHashMap,
  ReferendumId,
  InternalStatus,
  SuggestedVote,
} from "../types/properties";

// Extended type to include actual vote data from chain
interface ExtrinsicVoteData {
  extrinsicHash: string;
  actualVote: SuggestedVote | null;
}
import axios from "axios";
import { createSubsystemLogger, logError, formatError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { VotingDecision } from "../database/models/votingDecision";
import { MimirTransaction } from "../database/models/mimirTransaction";

const logger = createSubsystemLogger(Subsystem.MIMIR);

let isCheckingVotes = false;

/**
 * Checks for votes on multisig accounts using the database.
 * Updates the SQLite database with the vote status.
 * 
 * Removes the proposals that have been voted on from pending Mimir transactions.
 */
export async function checkForVotes(): Promise<void> {
  if (isCheckingVotes) {
    logger.debug('Previous checkForVotes operation still running, skipping...');
    return;
  }

  try {
    isCheckingVotes = true;
    
    // Clean up stale transactions first (configurable timeout, default 7 days)
    const staleCount = await MimirTransaction.getStaleTransactionCount(MIMIR_TRANSACTION_CLEANUP_DAYS);
    if (staleCount > 0) {
      const cleanedUp = await MimirTransaction.cleanupStaleTransactions(MIMIR_TRANSACTION_CLEANUP_DAYS);
      logger.info({ 
        cleanedUp, 
        staleCount, 
        cleanupDays: MIMIR_TRANSACTION_CLEANUP_DAYS 
      }, "Cleaned up stale Mimir transactions (likely deleted from Mimir)");
    }
    
    const pendingTransactions = await MimirTransaction.getPendingTransactions();

    if (pendingTransactions.length === 0) {
      logger.info("No pending Mimir transactions found.");
      return;
    }
    logger.info({ transactionsCount: pendingTransactions.length, pendingTransactions }, "Pending Mimir transactions found");

    const votedPolkadot = await fetchActiveVotes(
      process.env.POLKADOT_MULTISIG as string,
      Chain.Polkadot
    );
    const votedKusama = await fetchActiveVotes(
      process.env.KUSAMA_MULTISIG as string,
      Chain.Kusama
    );
    
    // Combine vote data from both chains
    const allVotesWithData = { ...votedPolkadot, ...votedKusama };
    const votedList = Object.keys(allVotesWithData).map(Number);

    const extrinsicVoteMap = await checkSubscan(votedList);

    // Process each pending transaction to check if it has been voted on
    for (const transaction of pendingTransactions) {
      const refId = transaction.post_id;
      const chain = transaction.chain;
      const found = votedList.includes(refId);
      
      if (!found) continue;

      logger.info({ referendumId: transaction.referendum_id, refId, chain }, `Referendum found for vote check`);

      // Get actual vote from on-chain data (most reliable)
      const chainVote = allVotesWithData[refId];
      
      // Get Subscan data for extrinsic hash
      const subscanData = extrinsicVoteMap[refId];
      const subscanLink = subscanData?.extrinsicHash ? buildSubscanLink(subscanData.extrinsicHash, chain) : undefined;
      
      // Use on-chain vote data as primary source, fallback to Subscan, then suggested vote
      const actualVote = chainVote || subscanData?.actualVote || transaction.voted;

      let votedStatus: InternalStatus;
      
      switch (actualVote) {
        case SuggestedVote.Aye:
          votedStatus = InternalStatus.VotedAye;
          break;
        case SuggestedVote.Nay:
          votedStatus = InternalStatus.VotedNay;
          break;
        case SuggestedVote.Abstain:
          votedStatus = InternalStatus.VotedAbstain;
          break;
        default:
          votedStatus = InternalStatus.NotVoted;
      }
      
      // Update the referendum status and add the subscan link
      await Referendum.updateVotingStatus(refId, chain, votedStatus, subscanLink);
      
      // Update the voting decision to mark as executed and store the actual vote
      await VotingDecision.upsert(transaction.referendum_id, {
        final_vote: actualVote,
        vote_executed: true,
        vote_executed_date: new Date().toISOString()
      });

      // Update the Mimir transaction status
      await MimirTransaction.updateStatus(
        transaction.referendum_id, 
        'executed', 
        subscanData?.extrinsicHash
      );

      logger.info({ 
        referendumId: transaction.referendum_id, 
        suggestedVote: transaction.voted,
        actualVote: actualVote,
        extrinsicHash: subscanData?.extrinsicHash
      }, `Database updated with actual vote status and Mimir transaction marked as executed`);
    }
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error checking vote statuses (checkForVotes)");
  } finally {
    isCheckingVotes = false;
  }
}



/**
 * Build Subscan link for the given extrinsic hash and chain
 */
function buildSubscanLink(extrinsicHash: string, chain: Chain): string {
  const baseUrl = chain === Chain.Polkadot 
    ? 'https://polkadot.subscan.io' 
    : 'https://kusama.subscan.io';
  return `${baseUrl}/extrinsic/${extrinsicHash}`;
}

/**
 * Fetches active votes for a given account on a given network using @polkadot/api.
 * 
 * @param account - The account to fetch votes for
 * @param network - The network to fetch votes from
 * @returns A map of referendum IDs to their actual vote data from chain
 */
async function fetchActiveVotes(
  account: string,
  network: Chain
): Promise<Record<number, SuggestedVote>> {
  try {
    const wsProvider = new WsProvider(
      network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER
    );
    const api = await ApiPromise.create({ provider: wsProvider });

    let voteMap: Record<number, SuggestedVote> = {};
    logger.info({ account, network }, `Fetching votes for account`);
    for (const trackId of TRACKS) {
      const votingResult = (await api.query.convictionVoting.votingFor(
        account,
        trackId
      )) as any;

      votingResult.toHuman().Casting.votes.forEach((vote: any) => {
        const refId = (vote[0] as string).split(",").join("");
        if (Number.isNaN(Number(refId))) throw "Invalid referendum ID";
        
        // Parse the actual vote data from chain
        const voteData = vote[1];
        let actualVote: SuggestedVote = SuggestedVote.Aye; // Default fallback
        
        if (voteData && typeof voteData === 'object') {
          if (voteData.Standard) {
            // Standard vote: check the aye field
            actualVote = voteData.Standard.vote?.aye === 'true' || voteData.Standard.vote?.aye === true 
              ? SuggestedVote.Aye 
              : SuggestedVote.Nay;
          } else if (voteData.Split) {
            // Split vote (Abstain): check if only abstain has value
            const { aye, nay, abstain } = voteData.Split;
            if (abstain && abstain !== '0' && (aye === '0' || !aye) && (nay === '0' || !nay)) {
              actualVote = SuggestedVote.Abstain;
            }
          }
        }
        
        voteMap[Number(refId)] = actualVote;
      });
    }

    await api.disconnect();
    return voteMap;
  } catch (error) {
    logger.error({ error: formatError(error), account, network }, `Error checking vote for account`);
    throw error;
  }
}

/**
 * Fetches extrinsic hashes and vote data for voted referendums using Subscan API.
 * 
 * @param votedList - The list of referendum IDs to get transaction hashes for
 * @returns A map of referendum IDs to their corresponding extrinsic hashes and vote data
 */
export async function checkSubscan(votedList: ReferendumId[]): Promise<Record<number, ExtrinsicVoteData>> {
  let polkadotExtrinsics: any[] = [];
  let kusamaExtrinsics: any[] = [];
  
  try {
    let extrinsicVoteMap: Record<number, ExtrinsicVoteData> = {};

    const polkadotSubscanUrl = `https://polkadot.api.subscan.io/api/scan/proxy/extrinsics`;
    const kusamaSubscanUrl = `https://kusama.api.subscan.io/api/scan/proxy/extrinsics`;
    
    const polkadotData = {
      account: process.env.POLKADOT_MULTISIG as string,
      row: SUBSCAN_ROW_COUNT,
      page: 0,
      order: 'desc'
    }

    const kusamaData = {
      account: process.env.KUSAMA_MULTISIG as string,
      row: SUBSCAN_ROW_COUNT,
      page: 0,
      order: 'desc'
    }
    
    const apiKey = process.env.SUBSCAN_API_KEY;
    if (!apiKey) {
      throw new Error('SUBSCAN_API_KEY is not set in environment variables');
    }

    // Fetch Polkadot extrinsics with error handling
    try {
      const polkadotResp = await axios.post(polkadotSubscanUrl, polkadotData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      });

      if (polkadotResp.data && polkadotResp.data.data && Array.isArray(polkadotResp.data.data.extrinsics)) {
        polkadotExtrinsics = polkadotResp.data.data.extrinsics;
      } else {
        logger.warn({ responseData: polkadotResp.data }, "Invalid Polkadot Subscan response structure");
      }
    } catch (polkadotError: any) {
      if (polkadotError.response?.status === 429) {
        logger.warn("Polkadot Subscan API rate limit exceeded, continuing with empty results");
      } else {
        logger.error({ error: formatError(polkadotError) }, "Error fetching Polkadot extrinsics from Subscan");
      }
    }

    // Fetch Kusama extrinsics with error handling
    try {
      const kusamaResp = await axios.post(kusamaSubscanUrl, kusamaData, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      });

      if (kusamaResp.data && kusamaResp.data.data && Array.isArray(kusamaResp.data.data.extrinsics)) {
        kusamaExtrinsics = kusamaResp.data.data.extrinsics;
      } else {
        logger.warn({ responseData: kusamaResp.data }, "Invalid Kusama Subscan response structure");
      }
    } catch (kusamaError: any) {
      if (kusamaError.response?.status === 429) {
        logger.warn("Kusama Subscan API rate limit exceeded, continuing with empty results");
      } else {
        logger.error({ error: formatError(kusamaError) }, "Error fetching Kusama extrinsics from Subscan");
      }
    }

    // Combine extrinsics from both networks
    const allExtrinsics = [...polkadotExtrinsics, ...kusamaExtrinsics];

    // Process each extrinsic to find referendum votes
    for (const extrinsic of allExtrinsics) {
      try {
        if (extrinsic.call_module === 'ConvictionVoting' && extrinsic.call_module_function === 'vote') {
          const refId = parseReferendumIdFromExtrinsic(extrinsic);
          
          if (refId && votedList.includes(refId)) {
            const actualVote = parseVoteFromExtrinsic(extrinsic);
            
            extrinsicVoteMap[refId] = {
              extrinsicHash: extrinsic.extrinsic_hash,
              actualVote: actualVote
            };
          }
        }
      } catch (error) {
        logger.warn({ error: (error as Error).message, extrinsic: extrinsic.extrinsic_hash }, 
          "Error processing extrinsic");
      }
    }

    logger.info({ mappedCount: Object.keys(extrinsicVoteMap).length }, "Completed extrinsic hash and vote mapping");
    return extrinsicVoteMap;
    
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error in checkSubscan");
    return {};
  }
}

/**
 * Parse referendum ID from extrinsic parameters
 */
function parseReferendumIdFromExtrinsic(extrinsic: any): number | null {
  try {
    if (extrinsic.params && Array.isArray(extrinsic.params)) {
      // Look for the referendum ID in the parameters
      for (const param of extrinsic.params) {
        if (param.name === 'poll_index' || param.name === 'ref_index') {
          const refId = parseInt(param.value);
          if (!isNaN(refId)) {
            return refId;
          }
        }
      }
    }
    return null;
  } catch (error) {
    logger.warn({ error: (error as Error).message }, "Error parsing referendum ID from extrinsic");
    return null;
  }
}

/**
 * Parse the actual vote direction from extrinsic parameters
 */
function parseVoteFromExtrinsic(extrinsic: any): SuggestedVote | null {
  try {
    if (extrinsic.params && Array.isArray(extrinsic.params)) {
      // Look for the vote parameter
      for (const param of extrinsic.params) {
        if (param.name === 'vote') {
          const voteData = param.value;
          
          // Handle different vote structures
          if (typeof voteData === 'object') {
            // Standard vote: { Standard: { vote: { aye: true/false, conviction: number }, balance: number } }
            if (voteData.Standard) {
              const aye = voteData.Standard.vote?.aye;
              if (aye === true) return SuggestedVote.Aye;
              if (aye === false) return SuggestedVote.Nay;
            }
            // Split vote (Abstain): { Split: { aye: 0, nay: 0, abstain: balance } }
            else if (voteData.Split) {
              const { aye, nay, abstain } = voteData.Split;
              if (abstain > 0 && aye === 0 && nay === 0) {
                return SuggestedVote.Abstain;
              }
            }
          }
          
          // Try parsing as string (sometimes Subscan returns string representations)
          if (typeof voteData === 'string') {
            const lowerVote = voteData.toLowerCase();
            if (lowerVote.includes('aye') || lowerVote.includes('true')) return SuggestedVote.Aye;
            if (lowerVote.includes('nay') || lowerVote.includes('false')) return SuggestedVote.Nay;
            if (lowerVote.includes('abstain') || lowerVote.includes('split')) return SuggestedVote.Abstain;
          }
        }
      }
    }
    return null;
  } catch (error) {
    logger.warn({ error: (error as Error).message }, "Error parsing vote from extrinsic");
    return null;
  }
}
