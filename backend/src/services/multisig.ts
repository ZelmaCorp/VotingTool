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
   * Generic addresses start with 5, network-specific start with 1 (Polkadot) or J (Kusama)
   */
  private convertToNetworkAddress(address: string, network: "Polkadot" | "Kusama"): string {
    try {
      // Decode the generic address to get the public key
      const publicKey = decodeAddress(address);
      
      // Encode to the specific network format
      const networkPrefix = network === "Polkadot" ? 0 : 2; // 0 for Polkadot, 2 for Kusama
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

    logger.info({ 
      network, 
      cacheKey, 
      now, 
      expiry, 
      hasCache: this.cache.has(cacheKey),
      cacheExpired: now >= expiry
    }, 'getCachedTeamMembers called');

    if (this.cache.has(cacheKey) && now < expiry) {                                             
      const cachedMembers = this.cache.get(cacheKey) || [];
      logger.debug({ network, cacheHit: true, memberCount: cachedMembers.length }, 'Returning cached multisig members');
      return cachedMembers;
    }

    logger.info({ network }, 'Cache expired or missing, fetching fresh multisig members');
    const members = await this.fetchMultisigMembers(network);
    
    logger.info({ network, memberCount: members.length }, 'Fresh members fetched, updating cache');
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
      logger.info({ network, multisigAddress }, 'Checking if address is a proxy/delegate');
      
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
        
        // Check if this is a delegate/proxy account
        if (accountData.delegate && typeof accountData.delegate === 'object' && accountData.delegate.conviction_delegated && Array.isArray(accountData.delegate.conviction_delegated)) {
          // Look for the parent address in any of the conviction_delegated entries
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
        
        logger.info({ 
          network, 
          currentAddress: multisigAddress,
          isProxy: false
        }, 'Address is not a proxy');
        
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
      // First, check if this is a proxy/delegate account
      const parentInfo = await this.getParentAddress(network);
      
      // Determine which address to use for fetching members
      let targetAddress = multisigAddress;
      if (parentInfo.isProxy && parentInfo.parentAddress) {
        logger.info({ 
          network, 
          originalAddress: multisigAddress, 
          parentAddress: parentInfo.parentAddress 
        }, 'Using parent address for member fetch (proxy detected)');
        targetAddress = parentInfo.parentAddress;
      }

      logger.info({ network, targetAddress }, 'Querying Subscan for multisig info');
      
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

        // Check if this is a delegate/proxy account
        if (accountData.delegate && typeof accountData.delegate === 'object' && accountData.delegate.conviction_delegated && Array.isArray(accountData.delegate.conviction_delegated)) {
          logger.info({ network, targetAddress, delegateCount: accountData.delegate.conviction_delegated.length }, 'Found delegate account, extracting members');
          
          // Extract members from the conviction_delegated array
          for (const entry of accountData.delegate.conviction_delegated) {
            if (entry.account?.address) {
              const memberAddress = entry.account.address;
              const memberName = entry.account.people?.display || 'Unknown';
              
              members.push({
                wallet_address: memberAddress,
                team_member_name: memberName,
                network: network
              });
            }
          }
          
          logger.info({ network, targetAddress, membersCount: members.length }, 'Successfully extracted members from delegate account');
          return members;
        }

        // Check if this is a direct multisig account
        if (accountData.multisig && accountData.multisig.multi_account_member && Array.isArray(accountData.multisig.multi_account_member)) {
          logger.info({ network, targetAddress, multisigCount: accountData.multisig.multi_account_member.length }, 'Found direct multisig account, extracting members');
          
          // Extract members from the multi_account_member array
          for (const entry of accountData.multisig.multi_account_member) {
            if (entry.address) {
              const memberAddress = entry.address;
              const memberName = entry.people?.display || 'Unknown';
              
              members.push({
                wallet_address: memberAddress,
                team_member_name: memberName,
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
    
    // Debug logging to see exact format comparison
    logger.info({ 
      walletAddress, 
      walletAddressLength: walletAddress.length,
      walletAddressType: typeof walletAddress,
      membersCount: members.length,
      memberAddresses: members.map(m => ({ 
        address: m.wallet_address, 
        length: m.wallet_address.length,
        type: typeof m.wallet_address,
        matches: m.wallet_address === walletAddress
      }))
    }, 'Checking if wallet address is team member');
    
    // Try exact match first
    let isMember = members.some(member => member.wallet_address === walletAddress);
    
    // If no exact match, try the converted network-specific address
    if (!isMember) {
      const networkAddress = this.convertToNetworkAddress(walletAddress, network);
      logger.info({ 
        walletAddress, 
        networkAddress, 
        network,
        originalMatch: false
      }, 'Trying converted network address');
      
      isMember = members.some(member => member.wallet_address === networkAddress);
      
      if (isMember) {
        logger.info({ 
          walletAddress, 
          networkAddress,
          originalMatch: false,
          networkMatch: true 
        }, 'Found match with converted network address');
      }
    }
    
    // If still no match, try case-insensitive and trimmed comparison
    if (!isMember) {
      const normalizedWalletAddress = walletAddress.trim().toLowerCase();
      isMember = members.some(member => 
        member.wallet_address.trim().toLowerCase() === normalizedWalletAddress
      );
      
      if (isMember) {
        logger.info({ 
          walletAddress, 
          normalizedWalletAddress,
          originalMatch: false,
          normalizedMatch: true 
        }, 'Found match after normalization');
      }
    }
    
    logger.info({ walletAddress, isMember, network }, 'Team member check result');
    
    return isMember;
  }

  /**
   * Get multisig member info by wallet address
   */
  async getTeamMemberByAddress(walletAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigMember | null> {
    const members = await this.getCachedTeamMembers(network);
    return members.find(member => member.wallet_address === walletAddress) || null;
  }
}

// Export a singleton instance
export const multisigService = new MultisigService(); 