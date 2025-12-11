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
  ReferendumId,
  InternalStatus,
  SuggestedVote,
} from "../types/properties";

// Extended type to include actual vote data from chain
interface ExtrinsicVoteData {
  extrinsicHash: string;
  actualVote: SuggestedVote | null;
}

// Vote data with chain information
interface VoteWithChain {
  vote: SuggestedVote;
  chain: Chain;
}
import axios from "axios";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { VotingDecision } from "../database/models/votingDecision";
import { MimirTransaction } from "../database/models/mimirTransaction";
import { DAO } from "../database/models/dao";
import { multisigService } from "../services/multisig";

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
    // Extract post IDs for Subscan (without chain prefix)
    const votedList = Array.from(new Set(
      Object.keys(allVotesWithData).map(key => Number(key.split(':')[1]))
    )).filter(id => !isNaN(id));
    
    logger.info({ 
      votedCount: votedList.length, 
      votedReferendums: votedList,
      voteMapSize: Object.keys(allVotesWithData).length
    }, "Total voted referendums found across all DAOs");
    
    // Log each vote found
    for (const [key, data] of Object.entries(allVotesWithData)) {
      const postId = key.split(':')[1];
      logger.info({ postId: Number(postId), chain: data.chain, vote: data.vote }, "Vote found on chain");
    }

    const extrinsicVoteMap = await checkSubscan(votedList, daos);

    // Log pending transactions for debugging
    logger.info({ pendingCount: pendingTransactions.length }, "Processing pending transactions");
    for (const t of pendingTransactions) {
      logger.info({ 
        postId: t.post_id, 
        chain: t.chain, 
        referendumId: t.referendum_id 
      }, "Pending transaction");
    }

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
 * Returns a map keyed by "chain:postId" to avoid collisions between chains
 */
async function fetchAllDaoVotes(daos: Awaited<ReturnType<typeof DAO.getAll>>): Promise<Record<string, VoteWithChain>> {
  let allVotesWithData: Record<string, VoteWithChain> = {};
  
  for (const dao of daos) {
    const polkadotMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Polkadot);
    if (polkadotMultisig) {
      logger.debug({ daoId: dao.id, daoName: dao.name, chain: 'Polkadot', multisig: polkadotMultisig }, "Fetching votes for DAO");
      
      // Try fetching votes from the multisig account
      let votedPolkadot = await fetchActiveVotes(polkadotMultisig, Chain.Polkadot);
      
      // If no votes found, check if it's a proxy and try the proxy account
      if (Object.keys(votedPolkadot).length === 0) {
        logger.info({ daoId: dao.id, multisig: polkadotMultisig }, "No votes found on multisig, checking if it's a proxy");
        try {
          const proxyInfo = await multisigService.getParentAddress(polkadotMultisig, "Polkadot");
          if (proxyInfo.isProxy && proxyInfo.parentAddress) {
            logger.info({ 
              daoId: dao.id, 
              multisig: polkadotMultisig, 
              proxyAccount: proxyInfo.parentAddress 
            }, "Multisig is a proxy, fetching votes from proxy account");
            votedPolkadot = await fetchActiveVotes(proxyInfo.parentAddress, Chain.Polkadot);
          }
        } catch (error) {
          logger.warn({ error: formatError(error), daoId: dao.id }, "Error checking for proxy account");
        }
      }
      
      // Store with chain prefix to avoid collisions
      for (const [postId, vote] of Object.entries(votedPolkadot)) {
        const key = `${Chain.Polkadot}:${postId}`;
        allVotesWithData[key] = { vote, chain: Chain.Polkadot };
      }
    }
    
    const kusamaMultisig = await DAO.getDecryptedMultisig(dao.id, Chain.Kusama);
    if (kusamaMultisig) {
      logger.debug({ daoId: dao.id, daoName: dao.name, chain: 'Kusama', multisig: kusamaMultisig }, "Fetching votes for DAO");
      
      // Try fetching votes from the multisig account
      let votedKusama = await fetchActiveVotes(kusamaMultisig, Chain.Kusama);
      
      // If no votes found, check if it's a proxy and try the proxy account
      if (Object.keys(votedKusama).length === 0) {
        logger.info({ daoId: dao.id, multisig: kusamaMultisig }, "No votes found on multisig, checking if it's a proxy");
        try {
          const proxyInfo = await multisigService.getParentAddress(kusamaMultisig, "Kusama");
          if (proxyInfo.isProxy && proxyInfo.parentAddress) {
            logger.info({ 
              daoId: dao.id, 
              multisig: kusamaMultisig, 
              proxyAccount: proxyInfo.parentAddress 
            }, "Multisig is a proxy, fetching votes from proxy account");
            votedKusama = await fetchActiveVotes(proxyInfo.parentAddress, Chain.Kusama);
          }
        } catch (error) {
          logger.warn({ error: formatError(error), daoId: dao.id }, "Error checking for proxy account");
        }
      }
      
      // Store with chain prefix to avoid collisions
      for (const [postId, vote] of Object.entries(votedKusama)) {
        const key = `${Chain.Kusama}:${postId}`;
        allVotesWithData[key] = { vote, chain: Chain.Kusama };
      }
    }
  }
  
  return allVotesWithData;
}

/**
 * Process a single pending transaction and update database
 */
async function processPendingTransaction(
  transaction: Awaited<ReturnType<typeof MimirTransaction.getPendingTransactions>>[0],
  allVotesWithData: Record<string, VoteWithChain>,
  extrinsicVoteMap: Record<number, ExtrinsicVoteData>
): Promise<void> {
  const refId = transaction.post_id;
  const chain = transaction.chain;
  // Check for vote with chain prefix to ensure we match the correct chain
  const voteKey = `${chain}:${refId}`;
  const voteData = allVotesWithData[voteKey];
  
  if (!voteData) {
    const availableKeys = Object.keys(allVotesWithData);
    logger.warn({ 
      refId, 
      chain, 
      referendumId: transaction.referendum_id,
      voteKey,
      availableVoteCount: availableKeys.length,
      availableVoteKeys: availableKeys.slice(0, 10) // Log first 10 to avoid huge logs
    }, "Referendum not found in voted list for this chain, skipping");
    return;
  }

  logger.info({ referendumId: transaction.referendum_id, refId, chain, vote: voteData.vote }, `Referendum found for vote check`);

  const chainVote = voteData.vote;
  const subscanData = extrinsicVoteMap[refId];
  const subscanLink = subscanData?.extrinsicHash ? buildSubscanLink(subscanData.extrinsicHash, chain) : undefined;
  // Prioritize chain vote over Subscan data (chain is source of truth)
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

async function fetchActiveVotes(
  account: string,
  network: Chain
): Promise<Record<number, SuggestedVote>> {
  try {
    const provider = new WsProvider(network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER);
    const api = await ApiPromise.create({ provider });
    const voteMap: Record<number, SuggestedVote> = {};

    logger.info({ account, network }, `Fetching votes for account`);
    
    // Log the raw query result for debugging
    try {
      const testResult = await api.query.convictionVoting.votingFor(account, 0) as any;
      const testHuman = testResult.toHuman();
      logger.debug({ account, network, testResultType: typeof testResult, hasTestResult: !!testResult, testHumanKeys: testHuman ? Object.keys(testHuman) : [] }, "Test query result structure");
    } catch (testError) {
      logger.warn({ error: formatError(testError), account, network }, "Error in test query");
    }
    
    for (const trackId of TRACKS) {
      try {
        const votingResult = await api.query.convictionVoting.votingFor(account, trackId) as any;
        const humanResult = votingResult.toHuman();
        
        // Log the structure for debugging
        logger.debug({ trackId, network, account, hasResult: !!humanResult, resultKeys: humanResult ? Object.keys(humanResult) : [] }, "Query result for track");
        
        // Check if there's any voting data at all
        if (!humanResult) {
          logger.debug({ trackId, network }, "No result from query");
          continue;
        }
        
        // Check for different vote storage structures
        if (!humanResult.Casting) {
          // Maybe it's Delegating or something else?
          logger.debug({ trackId, network, resultKeys: Object.keys(humanResult), resultStructure: humanResult }, "No Casting votes found, checking structure");
          continue;
        }
        
        const votes = humanResult.Casting.votes || [];
        logger.debug({ trackId, network, voteCount: votes.length, votesStructure: Array.isArray(votes) ? 'array' : typeof votes }, "Checking track for votes");

        for (const [refIdStr, voteData] of votes) {
          const refId = Number(refIdStr.split(",").join(""));
          if (isNaN(refId)) {
            logger.debug({ refIdStr, network, trackId }, "Skipping invalid referendum ID");
            continue;
          }

          // Log the raw vote data structure for debugging
          logger.debug({ 
            refId, 
            network, 
            trackId,
            voteDataType: typeof voteData,
            voteDataKeys: voteData && typeof voteData === 'object' ? Object.keys(voteData) : [],
            voteDataString: JSON.stringify(voteData).substring(0, 200) // First 200 chars
          }, "Raw vote data from chain");
          
          const parsedVote = parseVoteFromChainData(voteData);
          if (parsedVote) {
            voteMap[refId] = parsedVote;
            logger.info({ refId, vote: parsedVote, network, trackId }, "Found vote on chain");
          } else {
            logger.warn({ 
              refId, 
              network, 
              trackId,
              voteDataStructure: voteData,
              voteDataString: JSON.stringify(voteData)
            }, "Vote data could not be parsed - need to check structure");
          }
        }
      } catch (error) {
        logger.error({ error: formatError(error), trackId, network, account }, "Error querying track for votes");
      }
    }

    await api.disconnect();
    logger.info({ account, network, voteCount: Object.keys(voteMap).length, votedRefs: Object.keys(voteMap).map(Number) }, "Completed fetching votes for account");
    return voteMap;
  } catch (error) {
    logger.error({ error: formatError(error), account, network }, `Error checking vote for account`);
    throw error;
  }
}

function parseVoteFromChainData(voteData: any): SuggestedVote | null {
  if (!voteData || typeof voteData !== 'object') {
    logger.debug({ voteData, voteDataType: typeof voteData }, "Vote data is not an object");
    return null;
  }

  // Log the structure for debugging
  const dataKeys = Object.keys(voteData);
  logger.debug({ dataKeys, voteData }, "Parsing vote data structure");

  // Check for Standard vote structure
  if (voteData.Standard) {
    const standard = voteData.Standard;
    logger.debug({ standard, standardKeys: Object.keys(standard) }, "Found Standard vote structure");
    
    // The vote might be nested differently
    let aye: any = null;
    if (standard.vote) {
      if (typeof standard.vote === 'object') {
        aye = standard.vote.aye;
      } else {
        // Sometimes vote is just a boolean directly
        aye = standard.vote;
      }
    } else if (standard.aye !== undefined) {
      // Sometimes aye is directly on Standard
      aye = standard.aye;
    }
    
    logger.debug({ aye, ayeType: typeof aye, ayeValue: aye }, "Extracted aye value from Standard");
    
    if (aye === true || aye === 'true' || aye === 1 || aye === '1' || aye === 'Yes') {
      logger.debug({ aye, voteType: 'Aye' }, "Parsed Standard Aye vote");
      return SuggestedVote.Aye;
    }
    if (aye === false || aye === 'false' || aye === 0 || aye === '0' || aye === 'No') {
      logger.debug({ aye, voteType: 'Nay' }, "Parsed Standard Nay vote");
      return SuggestedVote.Nay;
    }
    logger.debug({ aye, standard }, "Standard vote with unrecognized aye value");
  }

  // Check for Split vote structure
  if (voteData.Split) {
    const split = voteData.Split;
    logger.debug({ split, splitKeys: Object.keys(split) }, "Found Split vote structure");
    
    const aye = split.aye;
    const nay = split.nay;
    const abstain = split.abstain;
    
    const ayeNum = Number(aye);
    const nayNum = Number(nay);
    const abstainNum = Number(abstain);
    
    logger.debug({ aye, nay, abstain, ayeNum, nayNum, abstainNum }, "Split vote values");
    
    if (abstainNum > 0 && ayeNum === 0 && nayNum === 0) {
      logger.debug({ aye, nay, abstain, voteType: 'Abstain' }, "Parsed Split Abstain vote");
      return SuggestedVote.Abstain;
    }
    logger.debug({ aye, nay, abstain }, "Split vote does not match abstain pattern");
  }

  // Check if it's a direct boolean or string
  if (typeof voteData === 'boolean' || typeof voteData === 'string') {
    logger.debug({ voteData }, "Vote data is direct boolean/string");
    if (voteData === true || voteData === 'true' || voteData === 'Yes' || voteData === 'Aye') {
      return SuggestedVote.Aye;
    }
    if (voteData === false || voteData === 'false' || voteData === 'No' || voteData === 'Nay') {
      return SuggestedVote.Nay;
    }
  }

  logger.debug({ 
    voteData, 
    voteDataKeys: dataKeys,
    hasStandard: !!voteData.Standard, 
    hasSplit: !!voteData.Split,
    voteDataString: JSON.stringify(voteData).substring(0, 500)
  }, "Vote data structure not recognized");
  return null;
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
            // Return empty array - don't block processing
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
