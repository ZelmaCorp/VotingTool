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
  if (isCheckingVotes) return;

  try {
    isCheckingVotes = true;
    await cleanupStaleTransactions();
    
    const pendingTransactions = await MimirTransaction.getPendingTransactions();
    if (pendingTransactions.length === 0) {
      logger.info("No pending Mimir transactions found");
      return;
    }

    const daos = await DAO.getAll(true);
    if (daos.length === 0) {
      logger.warn("No active DAOs found");
      return;
    }
    
    const allVotesWithData = await fetchAllDaoVotes(daos);
    const votedList = extractPostIds(allVotesWithData);
    
    logger.info({ votedCount: votedList.length, pendingCount: pendingTransactions.length }, 
      "Processing votes");

    const extrinsicVoteMap = await checkSubscan(votedList, daos);

    for (const transaction of pendingTransactions) {
      await processPendingTransaction(transaction, allVotesWithData, extrinsicVoteMap);
    }
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error checking votes");
  } finally {
    isCheckingVotes = false;
  }
}

function extractPostIds(votesMap: Record<string, VoteWithChain>): number[] {
  return Array.from(new Set(
    Object.keys(votesMap).map(key => Number(key.split(':')[1]))
  )).filter(id => !isNaN(id));
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

async function fetchAllDaoVotes(daos: Awaited<ReturnType<typeof DAO.getAll>>): Promise<Record<string, VoteWithChain>> {
  const allVotes: Record<string, VoteWithChain> = {};
  
  for (const dao of daos) {
    const polkadotVotes = await fetchDaoVotesForChain(dao, Chain.Polkadot);
    const kusamaVotes = await fetchDaoVotesForChain(dao, Chain.Kusama);
    
    Object.assign(allVotes, polkadotVotes, kusamaVotes);
  }
  
  return allVotes;
}

async function fetchDaoVotesForChain(dao: any, chain: Chain): Promise<Record<string, VoteWithChain>> {
  const multisig = await DAO.getDecryptedMultisig(dao.id, chain);
  if (!multisig) return {};
  
  let votes = await fetchActiveVotes(multisig, chain);
  
  // If no votes, try proxy account
  if (Object.keys(votes).length === 0) {
    votes = await tryFetchFromProxy(multisig, chain, dao.id);
  }
  
  return convertToChainKeyedVotes(votes, chain);
}

async function tryFetchFromProxy(multisig: string, chain: Chain, daoId: number): Promise<Record<number, SuggestedVote>> {
  try {
    const network = chain === Chain.Polkadot ? "Polkadot" : "Kusama";
    const proxyInfo = await multisigService.getParentAddress(multisig, network);
    
    if (proxyInfo.isProxy && proxyInfo.parentAddress) {
      logger.info({ daoId, proxyAccount: proxyInfo.parentAddress }, 
        "Fetching votes from proxy account");
      return await fetchActiveVotes(proxyInfo.parentAddress, chain);
    }
  } catch (error) {
    logger.warn({ error: formatError(error), daoId }, "Error checking proxy");
  }
  return {};
}

function convertToChainKeyedVotes(votes: Record<number, SuggestedVote>, chain: Chain): Record<string, VoteWithChain> {
  const result: Record<string, VoteWithChain> = {};
  for (const [postId, vote] of Object.entries(votes)) {
    result[`${chain}:${postId}`] = { vote, chain };
  }
  return result;
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
    logger.warn({ refId, chain, referendumId: transaction.referendum_id }, 
      "Vote not found for referendum");
    return;
  }

  logger.info({ referendumId: transaction.referendum_id, refId, vote: voteData.vote }, 
    "Processing voted referendum");

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

async function fetchActiveVotes(account: string, network: Chain): Promise<Record<number, SuggestedVote>> {
  const provider = new WsProvider(network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER);
  const api = await ApiPromise.create({ provider });
  
  try {
    const voteMap: Record<number, SuggestedVote> = {};

    for (const trackId of TRACKS) {
      const trackVotes = await fetchTrackVotes(api, account, trackId, network);
      Object.assign(voteMap, trackVotes);
    }

    logger.info({ account, network, voteCount: Object.keys(voteMap).length }, 
      "Fetched votes");
    return voteMap;
  } finally {
    await api.disconnect();
  }
}

async function fetchTrackVotes(api: ApiPromise, account: string, trackId: number, network: Chain): Promise<Record<number, SuggestedVote>> {
  try {
    const votingResult = await api.query.convictionVoting.votingFor(account, trackId) as any;
    const votes = votingResult.toHuman()?.Casting?.votes || [];
    
    const trackVotes: Record<number, SuggestedVote> = {};
    for (const [refIdStr, voteData] of votes) {
      const refId = Number(refIdStr.replace(/,/g, ""));
      if (isNaN(refId)) continue;

      const parsedVote = parseVoteFromChainData(voteData);
      if (parsedVote) {
        trackVotes[refId] = parsedVote;
      }
    }
    return trackVotes;
  } catch (error) {
    logger.error({ error: formatError(error), trackId, network }, "Error querying track");
    return {};
  }
}

function parseVoteFromChainData(voteData: any): SuggestedVote | null {
  if (!voteData || typeof voteData !== 'object') return null;

  if (voteData.Standard) return parseStandardVote(voteData.Standard);
  if (voteData.Split) return parseSplitVote(voteData.Split);
  
  return null;
}

function parseStandardVote(standard: any): SuggestedVote | null {
  // AssetHub format: Standard.vote.vote = "Aye"/"Nay"/"Abstain" (string)
  if (standard.vote?.vote && typeof standard.vote.vote === 'string') {
    const vote = standard.vote.vote.toUpperCase();
    if (vote === 'AYE' || vote === 'YES') return SuggestedVote.Aye;
    if (vote === 'NAY' || vote === 'NO') return SuggestedVote.Nay;
    if (vote === 'ABSTAIN') return SuggestedVote.Abstain;
  }
  
  // Legacy format: Standard.vote.aye = true/false (boolean)
  const aye = standard.vote?.aye ?? standard.aye;
  if (aye === true || aye === 'true' || aye === 1 || aye === '1') {
    return SuggestedVote.Aye;
  }
  if (aye === false || aye === 'false' || aye === 0 || aye === '0') {
    return SuggestedVote.Nay;
  }
  
  return null;
}

function parseSplitVote(split: any): SuggestedVote | null {
  const { aye, nay, abstain } = split;
  if (Number(abstain) > 0 && Number(aye) === 0 && Number(nay) === 0) {
    return SuggestedVote.Abstain;
  }
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
    const apiKey = process.env.SUBSCAN_API_KEY;
    if (!apiKey) throw new Error('SUBSCAN_API_KEY not set');

    const allExtrinsics = await fetchAllExtrinsics(daos, apiKey);
    const extrinsicVoteMap = processExtrinsics(allExtrinsics, votedList);
    
    logger.info({ mappedCount: Object.keys(extrinsicVoteMap).length }, 
      "Mapped extrinsic hashes");
    return extrinsicVoteMap;
  } catch (error) {
    logger.error({ error: formatError(error) }, "Error in checkSubscan");
    return {};
  }
}

async function fetchAllExtrinsics(daos: any[], apiKey: string): Promise<any[]> {
  const fetchPromises = daos.flatMap(dao => [
    fetchDaoExtrinsics(dao, Chain.Polkadot, apiKey),
    fetchDaoExtrinsics(dao, Chain.Kusama, apiKey)
  ]);

  const results = await Promise.all(fetchPromises);
  return results.flat().flatMap(r => r.extrinsics);
}

async function fetchDaoExtrinsics(dao: any, chain: Chain, apiKey: string): Promise<{ chain: Chain; dao: any; extrinsics: any[] }> {
  const multisig = await DAO.getDecryptedMultisig(dao.id, chain);
  if (!multisig) return { chain, dao, extrinsics: [] };

  const url = chain === Chain.Polkadot
    ? 'https://assethub-polkadot.api.subscan.io/api/scan/proxy/extrinsics'
    : 'https://assethub-kusama.api.subscan.io/api/scan/proxy/extrinsics';

  try {
    const resp = await axios.post(url, {
      account: multisig,
      row: SUBSCAN_ROW_COUNT,
      page: 0,
      order: 'desc'
    }, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
    });

    if (resp.data?.data?.extrinsics && Array.isArray(resp.data.data.extrinsics)) {
      return { chain, dao, extrinsics: resp.data.data.extrinsics };
    }
    logger.warn({ daoId: dao.id, chain }, "Invalid Subscan response");
    return { chain, dao, extrinsics: [] };
  } catch (error: any) {
    if (error.response?.status !== 429) {
      logger.error({ error: formatError(error), daoId: dao.id, chain }, 
        "Error fetching extrinsics");
    }
    return { chain, dao, extrinsics: [] };
  }
}

function processExtrinsics(extrinsics: any[], votedList: ReferendumId[]): Record<number, ExtrinsicVoteData> {
  const voteMap: Record<number, ExtrinsicVoteData> = {};
  
  for (const extrinsic of extrinsics) {
    if (extrinsic.call_module !== 'ConvictionVoting' || extrinsic.call_module_function !== 'vote') {
      continue;
    }
    
    const refId = parseReferendumIdFromExtrinsic(extrinsic);
    if (refId && votedList.includes(refId)) {
      voteMap[refId] = {
        extrinsicHash: extrinsic.extrinsic_hash,
        actualVote: parseVoteFromExtrinsic(extrinsic)
      };
    }
  }
  
  return voteMap;
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
  const voteParam = extrinsic.params?.find((p: any) => p.name === 'vote');
  if (!voteParam) return null;

  const voteData = voteParam.value;
  if (typeof voteData === 'object') {
    if (voteData.Standard?.vote?.aye === true) return SuggestedVote.Aye;
    if (voteData.Standard?.vote?.aye === false) return SuggestedVote.Nay;
    if (voteData.Split) {
      const { aye, nay, abstain } = voteData.Split;
      if (abstain > 0 && aye === 0 && nay === 0) return SuggestedVote.Abstain;
    }
  }
  
  if (typeof voteData === 'string') {
    const vote = voteData.toLowerCase();
    if (vote.includes('aye')) return SuggestedVote.Aye;
    if (vote.includes('nay')) return SuggestedVote.Nay;
    if (vote.includes('abstain')) return SuggestedVote.Abstain;
  }
  
  return null;
}
