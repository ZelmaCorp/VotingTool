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
import { DAO } from "../database/models/dao";

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
    
    await cleanupStaleTransactions();
    
    const pendingTransactions = await MimirTransaction.getPendingTransactions();
    if (pendingTransactions.length === 0) {
      logger.info("No pending Mimir transactions found.");
      return;
    }
    logger.info({ transactionsCount: pendingTransactions.length }, "Pending Mimir transactions found");

    const daos = await DAO.getAll(true);
    if (daos.length === 0) {
      logger.warn("No active DAOs found");
      return;
    }
    
    const allVotesWithData = await fetchAllDaoVotes(daos);
    const votedList = Object.keys(allVotesWithData).map(Number);
    logger.info({ votedCount: votedList.length }, "Total voted referendums found across all DAOs");

    const extrinsicVoteMap = await checkSubscan(votedList, daos);

    for (const transaction of pendingTransactions) {
      await processPendingTransaction(transaction, allVotesWithData, extrinsicVoteMap);
    }
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error checking vote statuses (checkForVotes)");
  } finally {
    isCheckingVotes = false;
  }
}

/**
 * Clean up stale Mimir transactions
 */
async function cleanupStaleTransactions(): Promise<void> {
  const staleCount = await MimirTransaction.getStaleTransactionCount(MIMIR_TRANSACTION_CLEANUP_DAYS);
  if (staleCount > 0) {
    const cleanedUp = await MimirTransaction.cleanupStaleTransactions(MIMIR_TRANSACTION_CLEANUP_DAYS);
    logger.info({ 
      cleanedUp, 
      staleCount, 
      cleanupDays: MIMIR_TRANSACTION_CLEANUP_DAYS 
    }, "Cleaned up stale Mimir transactions (likely deleted from Mimir)");
  }
}

/**
 * Fetch votes for all DAOs across both Polkadot and Kusama
 */
async function fetchAllDaoVotes(daos: Awaited<ReturnType<typeof DAO.getAll>>): Promise<Record<number, SuggestedVote>> {
  let allVotesWithData: Record<number, SuggestedVote> = {};
  
  for (const dao of daos) {
    const polkadotMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Polkadot);
    if (polkadotMultisig) {
      logger.debug({ daoId: dao.id, daoName: dao.name, chain: 'Polkadot' }, "Fetching votes for DAO");
      const votedPolkadot = await fetchActiveVotes(polkadotMultisig, Chain.Polkadot);
      allVotesWithData = { ...allVotesWithData, ...votedPolkadot };
    }
    
    const kusamaMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Kusama);
    if (kusamaMultisig) {
      logger.debug({ daoId: dao.id, daoName: dao.name, chain: 'Kusama' }, "Fetching votes for DAO");
      const votedKusama = await fetchActiveVotes(kusamaMultisig, Chain.Kusama);
      allVotesWithData = { ...allVotesWithData, ...votedKusama };
    }
  }
  
  return allVotesWithData;
}

/**
 * Process a single pending transaction and update database
 */
async function processPendingTransaction(
  transaction: Awaited<ReturnType<typeof MimirTransaction.getPendingTransactions>>[0],
  allVotesWithData: Record<number, SuggestedVote>,
  extrinsicVoteMap: Record<number, ExtrinsicVoteData>
): Promise<void> {
  const refId = transaction.post_id;
  const chain = transaction.chain;
  const found = Object.keys(allVotesWithData).map(Number).includes(refId);
  
  if (!found) return;

  logger.info({ referendumId: transaction.referendum_id, refId, chain }, `Referendum found for vote check`);

  const chainVote = allVotesWithData[refId];
  const subscanData = extrinsicVoteMap[refId];
  const subscanLink = subscanData?.extrinsicHash ? buildSubscanLink(subscanData.extrinsicHash, chain) : undefined;
  const actualVote = chainVote || subscanData?.actualVote || transaction.voted;
  const votedStatus = getVotedStatus(actualVote);
  
  try {
    await updateReferendumVoteStatus(transaction, votedStatus, actualVote, subscanLink, subscanData?.extrinsicHash);
    
    logger.info({ 
      referendumId: transaction.referendum_id, 
      suggestedVote: transaction.voted,
      actualVote,
      extrinsicHash: subscanData?.extrinsicHash
    }, `Database updated with actual vote status and Mimir transaction marked as executed`);
  } catch (error) {
    logger.error({ 
      error: formatError(error), 
      referendumId: transaction.referendum_id,
      refId,
      chain,
      transaction
    }, "Failed to update transaction state, will retry on next run");
  }
}

/**
 * Get the internal status based on the actual vote
 */
function getVotedStatus(actualVote: SuggestedVote): InternalStatus {
  switch (actualVote) {
    case SuggestedVote.Aye:
      return InternalStatus.VotedAye;
    case SuggestedVote.Nay:
      return InternalStatus.VotedNay;
    case SuggestedVote.Abstain:
      return InternalStatus.VotedAbstain;
    default:
      return InternalStatus.NotVoted;
  }
}

/**
 * Update all three database records atomically (idempotent operations)
 */
async function updateReferendumVoteStatus(
  transaction: Awaited<ReturnType<typeof MimirTransaction.getPendingTransactions>>[0],
  votedStatus: InternalStatus,
  actualVote: SuggestedVote,
  subscanLink?: string,
  extrinsicHash?: string
): Promise<void> {
  await Referendum.updateVotingStatus(
    transaction.post_id, 
    transaction.chain, 
    transaction.dao_id, 
    votedStatus, 
    subscanLink
  );
  
  await VotingDecision.upsert(transaction.referendum_id, transaction.dao_id, {
    final_vote: actualVote,
    vote_executed: true,
    vote_executed_date: new Date().toISOString()
  });

  await MimirTransaction.updateStatus(
    transaction.referendum_id, 
    transaction.dao_id,
    'executed', 
    extrinsicHash
  );
}



/**
 * Build Subscan link for the given extrinsic hash and chain
 */
function buildSubscanLink(extrinsicHash: string, chain: Chain): string {
  const baseUrl = chain === Chain.Polkadot 
    ? 'https://assethub-polkadot.subscan.io' 
    : 'https://assethub-kusama.subscan.io';
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
 * @param daos - List of all DAOs to check
 * @returns A map of referendum IDs to their corresponding extrinsic hashes and vote data
 */
export async function checkSubscan(votedList: ReferendumId[], daos: Awaited<ReturnType<typeof DAO.getAll>>): Promise<Record<number, ExtrinsicVoteData>> {
  try {
    let extrinsicVoteMap: Record<number, ExtrinsicVoteData> = {};

    const polkadotSubscanUrl = `https://assethub-polkadot.api.subscan.io/api/scan/proxy/extrinsics`;
    const kusamaSubscanUrl = `https://assethub-kusama.api.subscan.io/api/scan/proxy/extrinsics`;
    
    const apiKey = process.env.SUBSCAN_API_KEY;
    if (!apiKey) {
      throw new Error('SUBSCAN_API_KEY is not set in environment variables');
    }

    // Fetch all extrinsics in parallel (both Polkadot and Kusama for all DAOs)
    const fetchPromises = daos.flatMap(async (dao) => {
      const promises: Promise<{ chain: Chain; dao: typeof daos[0]; extrinsics: any[] }>[] = [];
      
      // Polkadot fetch
      const polkadotMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Polkadot);
      if (polkadotMultisig) {
        promises.push(
          axios.post(polkadotSubscanUrl, {
            account: polkadotMultisig,
            row: SUBSCAN_ROW_COUNT,
            page: 0,
            order: 'desc'
          }, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey
            }
          })
          .then(resp => {
            if (resp.data && resp.data.data && Array.isArray(resp.data.data.extrinsics)) {
              logger.debug({ daoId: dao.id, daoName: dao.name, extrinsicsCount: resp.data.data.extrinsics.length }, 
                "Fetched Polkadot extrinsics for DAO");
              return { chain: Chain.Polkadot, dao, extrinsics: resp.data.data.extrinsics };
            }
            logger.warn({ daoId: dao.id, responseData: resp.data }, "Invalid Polkadot Subscan response structure");
            return { chain: Chain.Polkadot, dao, extrinsics: [] };
          })
          .catch((error: any) => {
            if (error.response?.status === 429) {
              logger.warn({ daoId: dao.id }, "Polkadot Subscan API rate limit exceeded for DAO");
            } else {
              logger.error({ error: formatError(error), daoId: dao.id }, "Error fetching Polkadot extrinsics from Subscan");
            }
            return { chain: Chain.Polkadot, dao, extrinsics: [] };
          })
        );
      }
      
      // Kusama fetch
      const kusamaMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Kusama);
      if (kusamaMultisig) {
        promises.push(
          axios.post(kusamaSubscanUrl, {
            account: kusamaMultisig,
            row: SUBSCAN_ROW_COUNT,
            page: 0,
            order: 'desc'
          }, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey
            }
          })
          .then(resp => {
            if (resp.data && resp.data.data && Array.isArray(resp.data.data.extrinsics)) {
              logger.debug({ daoId: dao.id, daoName: dao.name, extrinsicsCount: resp.data.data.extrinsics.length }, 
                "Fetched Kusama extrinsics for DAO");
              return { chain: Chain.Kusama, dao, extrinsics: resp.data.data.extrinsics };
            }
            logger.warn({ daoId: dao.id, responseData: resp.data }, "Invalid Kusama Subscan response structure");
            return { chain: Chain.Kusama, dao, extrinsics: [] };
          })
          .catch((error: any) => {
            if (error.response?.status === 429) {
              logger.warn({ daoId: dao.id }, "Kusama Subscan API rate limit exceeded for DAO");
            } else {
              logger.error({ error: formatError(error), daoId: dao.id }, "Error fetching Kusama extrinsics from Subscan");
            }
            return { chain: Chain.Kusama, dao, extrinsics: [] };
          })
        );
      }
      
      return Promise.all(promises);
    });

    // Wait for all fetches to complete in parallel
    const results = await Promise.all(fetchPromises);
    
    // Flatten results and combine all extrinsics
    const allExtrinsics = results.flat().flatMap(result => result.extrinsics);

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
