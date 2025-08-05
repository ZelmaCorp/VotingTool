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
  InternalStatus,
  ReferendumId,
  SuggestedVote,
} from "../types/properties";
import { NotionPageId, NotionProperties } from "../types/notion";
import axios from "axios";
import { findNotionPageByPostId, getNotionPages } from "../notion/findNotionPage";
import {
  loadReadyProposalsFromFile,
  saveReadyProposalsToFile,
} from "../utils/readyFileHandlers";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";
import { createSubsystemLogger, logError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.MIMIR);

const notionApiToken = process.env.NOTION_API_TOKEN;
let isCheckingVotes = false;

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
    const votedList = [...votedPolkadot, ...votedKusama];

    const pages = await getNotionPages();
    const extrinsicMap = await checkSubscan(votedList);

    readyProposals.forEach(async (proposal, index) => {
      const refId = Number(proposal.id);
      const found = votedList.includes(refId);
      if (!found) return;

      const page = await findNotionPageByPostId(pages, refId);

      if (page) {
        logger.info({ pageId: page.id, refId }, `Page found for vote check`);

        logger.debug({ extrinsicMap, refIdExtrinsic: extrinsicMap[refId] }, "Extrinsic mapping data");

        await updateNotionToVoted(page.id, proposal.voted, extrinsicMap[refId], page.properties?.["Chain"]?.select?.name as Chain);
        logger.info({ pageId: page.id, voted: proposal.voted }, `Notion page updated with vote status`);
        readyProposals.splice(index, 1);
        await saveReadyProposalsToFile(readyProposals, READY_FILE as string);
      } else {
        logError(logger, { refId }, "Page not found for referendum ID", ErrorType.PAGE_NOT_FOUND);
      }
    });
  } catch (error) {
    logger.error({ error }, "Error checking vote statuses (checkForVotes)");
  } finally {
    isCheckingVotes = false;
  }
}

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

/** Update a Referenda in the Notion database
 *  Referenda will be updated to VotedAye, VotedNay, VotedAbstain */
export async function updateNotionToVoted(
  pageId: NotionPageId,
  vote: SuggestedVote,
  subscanExtrinsicId: string,
  chain: Chain
): Promise<NotionPageId> {
  if (!subscanExtrinsicId) {
    throw new Error("Subscan extrinsic ID is undefined");
  }

  const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}`;

  const properties: NotionProperties = {};

  let status: InternalStatus;

  switch (vote) {
    case SuggestedVote.Aye:
      status = InternalStatus.VotedAye;
      break;
    case SuggestedVote.Nay:
      status = InternalStatus.VotedNay;
      break;
    case SuggestedVote.Abstain:
      status = InternalStatus.VotedAbstain;
      break;

    default:
      throw Error(`Invalid SuggestedVote value: ${vote}`);
  }

  properties["Internal status"] = {
    type: "status",
    status: { name: status },
  };

  properties["Voted link"] = {
    type: "url",
    url: `https://${chain.toLowerCase()}.subscan.io/extrinsic/${subscanExtrinsicId}`,
  };

  const data = { properties };

  try {
    const rateLimitHandler = RateLimitHandler.getInstance();
    
    await rateLimitHandler.executeWithRateLimit(
      async () => {
        return await axios.patch(notionApiUrl, data, {
          headers: {
            Authorization: `Bearer ${notionApiToken}`,
            "Content-Type": "application/json",
            "Notion-Version": process.env.NOTION_VERSION,
          },
        });
      },
      RATE_LIMIT_CONFIGS.critical,
      `update-voted-${pageId}`
    );

    return pageId;
  } catch (error) {
    const errorMessage = (error as any).response
      ? (error as any).response.data
      : (error as any).message;
    
    logger.error({ error: errorMessage, pageId }, 'Error updating voting status');
    throw new Error(`Failed to update Notion page voting status: ${errorMessage}`);
  }
}

export async function checkSubscan(votedList: ReferendumId[]): Promise<ExtrinsicHashMap> {
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

    const polkadotResp = await axios.post(polkadotSubscanUrl, polkadotData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    const kusamaResp = await axios.post(kusamaSubscanUrl, kusamaData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });

    const polkadotExtrinsics = polkadotResp.data.data.extrinsics;
    const kusamaExtrinsics = kusamaResp.data.data.extrinsics;

    const extrinsics = [...polkadotExtrinsics, ...kusamaExtrinsics];
    
    // Add nested extrinsics to the list
    for (const extrinsic of extrinsics) {
      if (extrinsic.params[0].name === 'calls') {
        logger.debug({ extrinsicHash: extrinsic.extrinsic_hash }, "Adding nested extrinsics to list");
        logger.debug({ nestedCalls: extrinsic.params[0].value }, "Nested extrinsic calls");

        const nestedExtrinsics = extrinsic.params[0].value.map((nestedCall: any) => ({
          ...nestedCall,
          extrinsic_hash: extrinsic.extrinsic_hash  // Preserve the parent extrinsic hash
        }));

        extrinsics.push(...nestedExtrinsics);
      }
    }

    // Create the extrinsic hash map
    for (const extrinsic of extrinsics) {      
      let rawReferendumId = extrinsic?.params?.[0]?.value;
      let referendumId = null;
      
      if (extrinsic?.params?.[0]?.value?.[0]?.call_name === "vote") {
        rawReferendumId = extrinsic.params[0].value[0].params[0].value;
        referendumId = rawReferendumId ? Number(rawReferendumId) : null;
        logger.debug({ referendumId, extrinsicHash: extrinsic.extrinsic_hash }, `Vote call referendum ID`);
      } else {
        referendumId = rawReferendumId ? Number(rawReferendumId) : null;
        logger.debug({ referendumId, extrinsicHash: extrinsic.extrinsic_hash }, `Regular referendum ID`);
      }
      
      if (referendumId !== null && votedList.includes(referendumId) && extrinsic.extrinsic_hash) {
        extrinsicHashMap[referendumId] = extrinsic.extrinsic_hash;
      }
    }

    return extrinsicHashMap;

  } catch (error: any) {
    throw new Error(`Error checking Subscan: ${error.message}`);
  }
}
