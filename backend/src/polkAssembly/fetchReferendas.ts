import axios from "axios";
import { FetchReferendaReturnType, PolkassemblyReferenda, PostType } from "../types/polkassemly";
import { Chain } from "../types/properties";
import { createSubsystemLogger, logError, formatError } from "../config/logger";
import { Subsystem, ErrorType } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.POLKASSEMBLY);

const TIMEOUT_MS = 10000; // 10 second timeout

/** Function to fetch data from Polkassembly API 
 *  network: the network to fetch data from (Polkadot or Kusama)
 *  limit: the number of posts to fetch
 *  returns: an object with the referendas and discussions
 */
export async function fetchDataFromAPI(limit: number = 200, network: Chain): Promise<FetchReferendaReturnType> {
  try {
    let referendas = [];
    let discussions = [];

    // Fetch data from Polkassembly  
    const url = `https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=${limit}`;
    const response = await axios.get(url, {
      headers: {
        "x-network": network.toLowerCase(),
      },
      timeout: TIMEOUT_MS,
    });

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.posts)) {
      logError(logger, { network, responseData: response.data }, "Invalid response structure from Polkassembly API", ErrorType.INVALID_RESPONSE);
      throw new Error(`Invalid response structure from Polkassembly API for network ${network}`);
    }

    const posts: PolkassemblyReferenda[] = response.data.posts;

    // Separate Discussions from Referendas (on-chain)
    for (const post of posts) {
      if (!post) continue; // Skip null/undefined posts
      try {
        post.network = network;
        if (post.type === PostType.ReferendumV2) {
          referendas.push(post);
        }
        if (post.type === PostType.Discussions) {
          discussions.push(post);
        }
      } catch (postError) {
        logger.error({ error: formatError(postError), post, network }, "Error processing post");
        // Continue processing other posts
      }
    }

    return {
      referendas,
      discussions
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        logError(logger, { network, timeout: TIMEOUT_MS }, "Timeout fetching data from Polkassembly API", ErrorType.TIMEOUT);
      } else if (error.response) {
        logger.error({ 
          error: `HTTP ${error.response.status}: ${error.response.statusText}`,
          network, 
          status: error.response.status, 
          statusText: error.response.statusText,
          data: error.response.data 
        }, "Error response from Polkassembly API");
      } else if (error.request) {
        logger.error({ error: "No response received", network, request: error.request }, "No response received from Polkassembly API");
      } else {
        logger.error({ error: error.message, network }, "Error setting up request to Polkassembly API");
      }
    } else {
      logger.error({ network, error: formatError(error) }, "Unexpected error fetching data from Polkassembly API");
    }
    // Throw the error instead of returning empty arrays to abort the entire refresh cycle
    throw error;
  }
}

/** Fetch content of a specific referendum post by ID */ 
export async function fetchReferendumContent(postId: number, network: Chain) {
  try {
    const response = await axios.get('https://api.polkassembly.io/api/v1/posts/on-chain-post', {
      params: {
        postId: postId,
        proposalType: 'referendums_v2',
      },
      headers: {
        'x-network': network.toLowerCase(),
        'Content-Type': 'application/json',
      },
      timeout: TIMEOUT_MS,
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching post content: ${response.status} ${response.statusText}`);
    }

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        logger.error({ error: `Timeout after ${TIMEOUT_MS}ms`, postId, network, timeout: TIMEOUT_MS }, "Timeout fetching referendum content");
      } else if (error.response) {
        logger.error({ 
          error: `HTTP ${error.response.status}: ${error.response.statusText}`,
          postId, 
          network, 
          status: error.response.status, 
          statusText: error.response.statusText 
        }, "Error response fetching referendum content");
      } else if (error.request) {
        logger.error({ error: "No response received", postId, network }, "No response received when fetching referendum content");
      } else {
        logger.error({ error: error.message, postId, network }, "Error setting up request for referendum content");
      }
    } else {
      logger.error({ postId, network, error: formatError(error) }, 'Unexpected error fetching referendum content');
    }
    // Throw the error instead of returning fallback content
    throw error;
  }
}