import axios from 'axios';
import { createSubsystemLogger } from '../config/logger';
import { Subsystem } from '../types/logging';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';

const logger = createSubsystemLogger(Subsystem.MULTISIG);

export interface MultisigMember {
  wallet_address: string;
  team_member_name: string;
  network: "Polkadot" | "Kusama" | "Unknown";
}

export class MultisigService {
    private subscanApiKey: string;
    private polkadotMultisig: string;
    private kusamaMultisig: string;
  private cache: Map<string, MultisigMember[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Convert a generic address to network-specific format
   */
  private convertToNetworkAddress(address: string, network: "Polkadot" | "Kusama"): string {
    try {
      const publicKey = decodeAddress(address);
      const networkPrefix = network === "Polkadot" ? 0 : 2;
      return encodeAddress(publicKey, networkPrefix);
    } catch (error) {
      logger.warn({ address, network, error }, 'Failed to convert address format, using original');
      return address;
    }
  }

    constructor() {
        this.subscanApiKey = process.env.SUBSCAN_API_KEY || '';
        this.polkadotMultisig = process.env.POLKADOT_MULTISIG || '';
        this.kusamaMultisig = process.env.KUSAMA_MULTISIG || '';

        if (!this.subscanApiKey) {
      logger.warn('SUBSCAN_API_KEY not configured - multisig member fetching will be limited');
        }
    }

    /**
   * Get cached team members for a network, refreshing if expired
   */
  async getCachedTeamMembers(network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigMember[]> {
    const cacheKey = `members_${network}`;
    const now = Date.now();
    const expiry = this.cacheExpiry.get(cacheKey) || 0;

    if (this.cache.has(cacheKey) && now < expiry) {                                             
      return this.cache.get(cacheKey) || [];
    }

    const members = await this.fetchMultisigMembers(network);
    this.cache.set(cacheKey, members);
    this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
    
    return members;
  }

  /**
   * Check if the configured multisig address is a proxy/delegate and extract parent address
   */
  async getParentAddress(network: "Polkadot" | "Kusama" = "Polkadot"): Promise<{ isProxy: boolean; parentAddress?: string; currentAddress: string; network: string }> {
    const multisigAddress = network === "Polkadot" ? this.polkadotMultisig : this.kusamaMultisig;
    
    if (!multisigAddress || !this.subscanApiKey) {
      return {
        isProxy: false,
        currentAddress: multisigAddress,
        network
      };
    }

    try {
      const response = await axios.post(
        `https://${network.toLowerCase()}.api.subscan.io/api/v2/scan/search`,
        { key: multisigAddress },
        {
          headers: {
            'X-API-Key': this.subscanApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === 0 && response.data.data?.account) {
        const accountData = response.data.data.account;
        
        if (accountData.delegate?.conviction_delegated) {
          for (const entry of accountData.delegate.conviction_delegated) {
            if (entry.delegate_account?.people?.parent?.address) {
              const parentAddress = entry.delegate_account.people.parent.address;
              
              logger.info({ 
                network, 
                currentAddress: multisigAddress,
                parentAddress,
                isProxy: true
              }, 'Found proxy account with parent address');
              
              return {
                isProxy: true,
                parentAddress,
                currentAddress: multisigAddress,
                network
              };
            }
          }
        }
        
        return {
          isProxy: false,
          currentAddress: multisigAddress,
          network
        };
      }
      
      return {
        isProxy: false,
        currentAddress: multisigAddress,
        network
      };
      
    } catch (error) {
      logger.error({ error, network, multisigAddress }, 'Error checking if address is proxy');
      return {
        isProxy: false,
        currentAddress: multisigAddress,
        network
      };
    }
  }

  /**
   * Fetch multisig members from Subscan v2 search API
   * Handles both delegate accounts and simple multisig accounts
   */
  private async fetchMultisigMembers(network: "Polkadot" | "Kusama"): Promise<MultisigMember[]> {
    const multisigAddress = network === "Polkadot" ? this.polkadotMultisig : this.kusamaMultisig;
    
    if (!multisigAddress || !this.subscanApiKey) {
      logger.warn({ network, hasAddress: !!multisigAddress, hasApiKey: !!this.subscanApiKey }, 
        'Cannot fetch multisig members - missing configuration');
      return [];
    }

    try {
      const parentInfo = await this.getParentAddress(network);
      
      let targetAddress = multisigAddress;
      if (parentInfo.isProxy && parentInfo.parentAddress) {
        targetAddress = parentInfo.parentAddress;
      }

      const response = await axios.post(
        `https://${network.toLowerCase()}.api.subscan.io/api/v2/scan/search`,
        { key: targetAddress },
        {
          headers: {
            'X-API-Key': this.subscanApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === 0 && response.data.data?.account) {
        const accountData = response.data.data.account;
        const members: MultisigMember[] = [];

        if (accountData.delegate?.conviction_delegated) {
          for (const entry of accountData.delegate.conviction_delegated) {
            if (entry.account?.address) {
              members.push({
                wallet_address: entry.account.address,
                team_member_name: entry.account.people?.display || 'Unknown',
                network: network
              });
            }
          }
          
          logger.info({ network, targetAddress, membersCount: members.length }, 'Successfully extracted members from delegate account');
          return members;
        }

        if (accountData.multisig?.multi_account_member) {
          for (const entry of accountData.multisig.multi_account_member) {
            if (entry.address) {
              members.push({
                wallet_address: entry.address,
                team_member_name: entry.people?.display || 'Unknown',
                network: network
              });
            }
          }
          
          logger.info({ network, targetAddress, membersCount: members.length }, 'Successfully extracted members from direct multisig account');
          return members;
        }

        logger.warn({ network, targetAddress }, 'No multisig or delegate data found in account');
        return [];

      } else {
        logger.warn({ network, targetAddress, responseCode: response.data.code }, 'Subscan API returned error or no data');
        return [];
      }

    } catch (error) {
      logger.error({ error, network, multisigAddress }, 'Error fetching multisig members');
      return [];
    }
  }

  /**
   * Check if a wallet address is a multisig member
   */
  async isTeamMember(walletAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<boolean> {
    const members = await this.getCachedTeamMembers(network);
    
    // Try exact match first
    let isMember = members.some(member => member.wallet_address === walletAddress);
    
    // If no exact match, try the converted network-specific address
    if (!isMember) {
      const networkAddress = this.convertToNetworkAddress(walletAddress, network);
      isMember = members.some(member => member.wallet_address === networkAddress);
    }
    
    // If still no match, try case-insensitive and trimmed comparison
    if (!isMember) {
      const normalizedWalletAddress = walletAddress.trim().toLowerCase();
      isMember = members.some(member => 
        member.wallet_address.trim().toLowerCase() === normalizedWalletAddress
      );
    }
    
    return isMember;
  }

  /**
   * Get multisig member info by wallet address
   */
  async getTeamMemberByAddress(walletAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigMember | null> {
    const members = await this.getCachedTeamMembers(network);
    
    // Try exact match first
    let member = members.find(m => m.wallet_address === walletAddress);
    
    // If no exact match, try the converted network-specific address
    if (!member) {
      const networkAddress = this.convertToNetworkAddress(walletAddress, network);
      member = members.find(m => m.wallet_address === networkAddress);
    }
    
    // If still no match, try case-insensitive and trimmed comparison
    if (!member) {
      const normalizedWalletAddress = walletAddress.trim().toLowerCase();
      member = members.find(m => 
        m.wallet_address.trim().toLowerCase() === normalizedWalletAddress
      );
    }
    
    return member || null;
  }

  /**
   * Find team member with flexible address matching
   * Used for matching addresses that might be in different formats
   */
  findMemberByAddress(members: MultisigMember[], walletAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): MultisigMember | null {
    logger.info({ 
      searchingFor: walletAddress, 
      network, 
      totalMembers: members.length,
      memberAddresses: members.map(m => m.wallet_address).slice(0, 5) // Show first 5 for debugging
    }, 'Searching for team member with flexible address matching');
    
    // Try exact match first
    let member = members.find(m => m.wallet_address === walletAddress);
    if (member) {
      logger.info({ walletAddress, foundMember: member.team_member_name }, 'Found exact address match');
      return member;
    }
    
    // If no exact match, try the converted network-specific address
    const networkAddress = this.convertToNetworkAddress(walletAddress, network);
    logger.info({ originalAddress: walletAddress, networkAddress, network }, 'Trying network-specific address conversion');
    
    member = members.find(m => m.wallet_address === networkAddress);
    if (member) {
      logger.info({ networkAddress, foundMember: member.team_member_name }, 'Found network-converted address match');
      return member;
    }
    
    // If still no match, try case-insensitive and trimmed comparison
    const normalizedWalletAddress = walletAddress.trim().toLowerCase();
    member = members.find(m => 
      m.wallet_address.trim().toLowerCase() === normalizedWalletAddress
    );
    if (member) {
      logger.info({ normalizedWalletAddress, foundMember: member.team_member_name }, 'Found normalized address match');
      return member;
    }
    
    logger.warn({ walletAddress, networkAddress, normalizedWalletAddress }, 'No address match found with any method');
    return null;
  }
}

// Export a singleton instance
export const multisigService = new MultisigService(); 