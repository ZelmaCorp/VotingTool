import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  KUSAMA_PROVIDER,
  POLKADOT_PROVIDER,
  READY_FILE,
  SUBSCAN_ROW_COUNT,
  TRACKS,
} from "../utils/constants";
import {
  Chain,
  ExtrinsicHashMap,
  ReferendumId,
} from "../types/properties";
import axios from "axios";
import {
  loadReadyProposalsFromFile,
  saveReadyProposalsToFile,
} from "../utils/readyFileHandlers";
import { createSubsystemLogger, logError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";
import { Referendum } from "../database/models/referendum";
import { VotingDecision } from "../database/models/votingDecision";

const logger = createSubsystemLogger(Subsystem.MIMIR);

let isCheckingVotes = false;

/**
 * Reads the ready proposals file and checks for votes on multisig accounts.
 * Updates the SQLite database with the vote status.
 * 
 * Removes the proposals that have been voted on from the ready proposals file.
 */
export async function checkForVotes(): Promise<void> {
  if (isCheckingVotes) {
    logger.debug('Previous checkForVotes operation still running, skipping...');
    return;
  }

  try {
    isCheckingVotes = true;
    const readyProposals = await loadReadyProposalsFromFile(
      READY_FILE as string
    );

    if (readyProposals.length === 0) {
      logger.info("No ready proposals found.");
      return;
    }
    logger.info({ proposalsCount: readyProposals.length, readyProposals }, "Ready proposals found");

    const votedPolkadot = await fetchActiveVotes(
      process.env.POLKADOT_MULTISIG as string,
      Chain.Polkadot
    );
    const votedKusama = await fetchActiveVotes(
      process.env.KUSAMA_MULTISIG as string,
      Chain.Kusama
    );
    // Ensure both vote arrays are valid before spreading
    const safeVotedPolkadot = Array.isArray(votedPolkadot) ? votedPolkadot : [];
    const safeVotedKusama = Array.isArray(votedKusama) ? votedKusama : [];
    const votedList = [...safeVotedPolkadot, ...safeVotedKusama];

    const extrinsicMap = await checkSubscan(votedList);

    // Process each proposal to check if it has been voted on
    for (let i = readyProposals.length - 1; i >= 0; i--) {
      const proposal = readyProposals[i];
      const refId = Number(proposal.id);
      const found = votedList.includes(refId);
      
      if (!found) continue;

      // Try to find the referendum in both networks since ReadyProposal doesn't store chain
      let referendum = await Referendum.findByPostIdAndChain(refId, Chain.Polkadot);
      let chain = Chain.Polkadot;
      
      if (!referendum) {
        referendum = await Referendum.findByPostIdAndChain(refId, Chain.Kusama);
        chain = Chain.Kusama;
      }

      if (referendum && referendum.id) {
        logger.info({ referendumId: referendum.id, refId, chain }, `Referendum found for vote check`);

        logger.debug({ extrinsicMap, refIdExtrinsic: extrinsicMap[refId] }, "Extrinsic mapping data");

        // Update the referendum to mark it as voted on
        // TODO: Parse actual vote direction from Subscan data instead of using suggested vote
        const subscanLink = extrinsicMap[refId] ? buildSubscanLink(extrinsicMap[refId], chain) : undefined;
        
        // For now, we don't update the internal status automatically - it should be manually reviewed
        // since the actual vote might differ from the suggested vote
        if (subscanLink) {
          await Referendum.update(refId, chain, { voted_link: subscanLink });
        }
        
        // Update the voting decision to mark as executed
        await VotingDecision.upsert(referendum.id, {
          vote_executed: true,
          vote_executed_date: new Date().toISOString()
        });

        logger.info({ referendumId: referendum.id, voted: proposal.voted }, `Database updated with vote status`);
        
        // Remove the proposal from ready proposals
        readyProposals.splice(i, 1);
        await saveReadyProposalsToFile(readyProposals, READY_FILE as string);
      } else {
        logError(logger, { refId }, "Referendum not found for referendum ID", ErrorType.PAGE_NOT_FOUND);
      }
    }
  } catch (error) {
    logger.error({ error }, "Error checking vote statuses (checkForVotes)");
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
 * @returns An array of referendum IDs that the account has voted on
 */
async function fetchActiveVotes(
  account: string,
  network: Chain
): Promise<ReferendumId[]> {
  try {
    const wsProvider = new WsProvider(
      network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER
    );
    const api = await ApiPromise.create({ provider: wsProvider });

    let allVotes: ReferendumId[] = [];
    logger.info({ account, network }, `Fetching votes for account`);
    for (const trackId of TRACKS) {
      const votingResult = (await api.query.convictionVoting.votingFor(
        account,
        trackId
      )) as any;

      votingResult.toHuman().Casting.votes.forEach((vote: any) => {
        const refId = (vote[0] as string).split(",").join("");
        if (Number.isNaN(Number(refId))) throw "Invalid referendum ID";
        allVotes.push(Number(refId));
      });
    }

    return allVotes;
  } catch (error) {
    logger.error({ error, account, network }, `Error checking vote for account`);
    throw error;
  }
}

/**
 * Fetches extrinsic hashes for voted referendums using Subscan API.
 * 
 * @param votedList - The list of referendum IDs to get transaction hashes for
 * @returns A map of referendum IDs to their corresponding extrinsic hashes
 */
export async function checkSubscan(votedList: ReferendumId[]): Promise<ExtrinsicHashMap> {
  let polkadotExtrinsics: any[] = [];
  let kusamaExtrinsics: any[] = [];
  
  try {
    let extrinsicHashMap: ExtrinsicHashMap = {};

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
        logger.error({ error: polkadotError.message }, "Error fetching Polkadot extrinsics from Subscan");
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
        logger.error({ error: kusamaError.message }, "Error fetching Kusama extrinsics from Subscan");
      }
    }

    // Combine extrinsics from both networks
    const allExtrinsics = [...polkadotExtrinsics, ...kusamaExtrinsics];
    logger.info({ 
      polkadotCount: polkadotExtrinsics.length, 
      kusamaCount: kusamaExtrinsics.length, 
      totalCount: allExtrinsics.length 
    }, "Fetched extrinsics from Subscan");

    // Process each extrinsic to find referendum votes
    for (const extrinsic of allExtrinsics) {
      try {
        if (extrinsic.call_module === 'ConvictionVoting' && extrinsic.call_module_function === 'vote') {
          // Parse the referendum ID from the extrinsic parameters
          const refId = parseReferendumIdFromExtrinsic(extrinsic);
          
          if (refId && votedList.includes(refId)) {
            extrinsicHashMap[refId] = extrinsic.extrinsic_hash;
            logger.debug({ refId, hash: extrinsic.extrinsic_hash }, "Mapped referendum to extrinsic hash");
          }
        }
      } catch (error) {
        logger.warn({ error: (error as Error).message, extrinsic: extrinsic.extrinsic_hash }, 
          "Error processing extrinsic");
      }
    }

    logger.info({ mappedCount: Object.keys(extrinsicHashMap).length }, "Completed extrinsic hash mapping");
    return extrinsicHashMap;
    
  } catch (error) {
    logger.error({ error: (error as Error).message }, "Error in checkSubscan");
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
