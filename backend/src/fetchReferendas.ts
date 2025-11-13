import axios from "axios";
import { FetchReferendaReturnType, PolkassemblyReferenda, PostType } from "./types/polkassemly";
import { Chain } from "./types/properties";
import { createSubsystemLogger, formatError } from "./config/logger";
import { Subsystem } from "./types/logging";

const logger = createSubsystemLogger(Subsystem.POLKASSEMBLY);


/** Function to fetch data from Polkassembly API */
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
    });

    const posts: PolkassemblyReferenda[] = response.data.posts;

    // Separate Discussions from Referendas (on-chain)
    for (const post of posts) {
        post.network = network;
        if (post.type === PostType.ReferendumV2) {
            referendas.push(post);
        }
        if (post.type === PostType.Discussions) {
            discussions.push(post);
        }
    }

    return {
        referendas,
        discussions
    }

  } catch (error) {
    logger.error({ error: formatError(error), network, limit }, "Error fetching data from Polkassembly API");
    return {
        referendas: [],
        discussions: []
    };
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
          });

        if (response.status !== 200) {
            throw new Error(`Error fetching post content: ${response.status} ${response.statusText}`);
        }

        return response.data;

    } catch (error) {
        logger.error({ error: formatError(error), postId, network }, 'Error fetching referendum content');
        return { content: 'No content available' };
    }
}