import axios from "axios";
import { FetchReferendaReturnType, PolkassemblyReferenda, PostType } from "../types/polkassemly";
import { Chain } from "../types/properties";

const TIMEOUT_MS = 10000; // 10 second timeout

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
      timeout: TIMEOUT_MS,
    });

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.posts)) {
      console.error("Invalid response structure from Polkassembly API");
      return {
        referendas: [],
        discussions: []
      };
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
        console.error("Error processing post:", postError);
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
        console.error("Timeout fetching data from Polkassembly API");
      } else if (error.response) {
        console.error("Error response from Polkassembly API:", error.response.status, error.response.statusText);
      } else if (error.request) {
        console.error("No response received from Polkassembly API");
      } else {
        console.error("Error setting up request to Polkassembly API:", error.message);
      }
    } else {
      console.error("Unexpected error fetching data from Polkassembly API:", (error as Error).message);
    }
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
      timeout: TIMEOUT_MS,
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching post content: ${response.status} ${response.statusText}`);
    }

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error("Timeout fetching referendum content");
      } else if (error.response) {
        console.error("Error response fetching referendum content:", error.response.status, error.response.statusText);
      } else if (error.request) {
        console.error("No response received when fetching referendum content");
      } else {
        console.error("Error setting up request for referendum content:", error.message);
      }
    } else {
      console.error('Unexpected error fetching referendum content:', (error as Error).message);
    }
    return { content: 'No content available' };
  }
}