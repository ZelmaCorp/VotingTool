import axios from "axios";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.APP);

interface MultisigMember {
  address: string;
  name?: string;
  network: "Polkadot" | "Kusama";
}

interface SubscanMultisigResponse {
  code: number;
  message: string;
  data?: {
    members?: Array<{
      address: string;
      name?: string;
    }>;
  };
}

/**
 * Multisig service for fetching multisig member data
 * Uses Subscan API to get multisig member addresses from on-chain multisig
 */
export class MultisigService {
  private subscanApiKey: string;
  private polkadotMultisig: string;
  private kusamaMultisig: string;

  constructor() {
    this.subscanApiKey = process.env.SUBSCAN_API_KEY || "";
    this.polkadotMultisig = process.env.POLKADOT_MULTISIG || "";
    this.kusamaMultisig = process.env.KUSAMA_MULTISIG || "";

    if (!this.subscanApiKey) {
      logger.warn("SUBSCAN_API_KEY not set - blockchain data fetching will be limited");
    }
    if (!this.polkadotMultisig) {
      logger.warn("POLKADOT_MULTISIG not set - Polkadot multisig members cannot be fetched");
    }
    if (!this.kusamaMultisig) {
      logger.warn("KUSAMA_MULTISIG not set - Kusama multisig members cannot be fetched");
    }
  }

  /**
   * Fetch multisig member addresses from Polkadot multisig
   */
  async getPolkadotTeamMembers(): Promise<MultisigMember[]> {
    if (!this.polkadotMultisig || !this.subscanApiKey) {
      logger.warn("Cannot fetch Polkadot multisig members - missing configuration");
      return [];
    }

    try {
      const response = await axios.get<SubscanMultisigResponse>(
        `https://polkadot.api.subscan.io/api/open/account/multisig`,
        {
          params: {
            address: this.polkadotMultisig
          },
          headers: {
            "X-API-Key": this.subscanApiKey
          }
        }
      );

      if (response.data.code === 0 && response.data.data?.members) {
        const members: MultisigMember[] = response.data.data.members.map(member => ({
          address: member.address,
          name: member.name,
          network: "Polkadot"
        }));

        logger.info({ count: members.length, network: "Polkadot" }, "Fetched Polkadot multisig members");
        return members;
      } else {
        logger.warn({ response: response.data }, "Unexpected Subscan response for Polkadot multisig");
        return [];
      }
    } catch (error) {
      logger.error({ error, network: "Polkadot" }, "Error fetching Polkadot multisig members");
      return [];
    }
  }

  /**
   * Fetch multisig member addresses from Kusama multisig
   */
  async getKusamaTeamMembers(): Promise<MultisigMember[]> {
    if (!this.kusamaMultisig || !this.subscanApiKey) {
      logger.warn("Cannot fetch Kusama multisig members - missing configuration");
      return [];
    }

    try {
      const response = await axios.get<SubscanMultisigResponse>(
        `https://kusama.api.subscan.io/api/open/account/multisig`,
        {
          params: {
            address: this.kusamaMultisig
          },
          headers: {
            "X-API-Key": this.subscanApiKey
          }
        }
      );

      if (response.data.code === 0 && response.data.data?.members) {
        const members: MultisigMember[] = response.data.data.members.map(member => ({
          address: member.address,
          name: member.name,
          network: "Kusama"
        }));

        logger.info({ count: members.length, network: "Kusama" }, "Fetched Kusama multisig members");
        return members;
      } else {
        logger.warn({ response: response.data }, "Unexpected Subscan response for Kusama multisig");
        return [];
      }
    } catch (error) {
      logger.error({ error, network: "Kusama" }, "Error fetching Kusama multisig members");
      return [];
    }
  }

  /**
   * Get all multisig members from both networks
   */
  async getAllTeamMembers(): Promise<MultisigMember[]> {
    const [polkadotMembers, kusamaMembers] = await Promise.all([
      this.getPolkadotTeamMembers(),
      this.getKusamaTeamMembers()
    ]);

    return [...polkadotMembers, ...kusamaMembers];
  }

  /**
   * Check if a wallet address is a multisig member
   */
  async isTeamMember(walletAddress: string): Promise<boolean> {
    try {
      const allMembers = await this.getAllTeamMembers();
      const isMember = allMembers.some(member => member.address === walletAddress);
      
      logger.debug({ walletAddress, isMember }, "Multisig membership check");
      return isMember;
    } catch (error) {
      logger.error({ error, walletAddress }, "Error checking multisig membership");
      return false;
    }
  }

  /**
   * Get multisig member info by address
   */
  async getTeamMemberByAddress(walletAddress: string): Promise<MultisigMember | null> {
    try {
      const allMembers = await this.getAllTeamMembers();
      const member = allMembers.find(member => member.address === walletAddress);
      
      return member || null;
    } catch (error) {
      logger.error({ error, walletAddress }, "Error getting multisig member by address");
      return null;
    }
  }

  /**
   * Cache multisig members for a short period to avoid excessive API calls
   * This is a simple in-memory cache - in production, consider Redis
   */
  private teamMembersCache: {
    data: MultisigMember[];
    timestamp: number;
    ttl: number;
  } = {
    data: [],
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 minutes
  };

  /**
   * Get cached multisig members or fetch fresh data
   */
  async getCachedTeamMembers(): Promise<MultisigMember[]> {
    const now = Date.now();
    
    if (now - this.teamMembersCache.timestamp < this.teamMembersCache.ttl) {
      logger.debug("Returning cached multisig members");
      return this.teamMembersCache.data;
    }

    logger.debug("Cache expired, fetching fresh multisig members");
    const members = await this.getAllTeamMembers();
    
    this.teamMembersCache = {
      data: members,
      timestamp: now,
      ttl: this.teamMembersCache.ttl
    };

    return members;
  }

  /**
   * Clear the multisig members cache
   */
  clearCache(): void {
    this.teamMembersCache = {
      data: [],
      timestamp: 0,
      ttl: 5 * 60 * 1000
    };
    logger.debug("Multisig members cache cleared");
  }
}

// Export singleton instance
export const multisigService = new MultisigService(); 