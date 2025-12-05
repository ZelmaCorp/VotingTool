import axios from 'axios';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';

const logger = createSubsystemLogger(Subsystem.MULTISIG);

export interface MultisigMember {
  wallet_address: string;
  team_member_name: string;
  network: "Polkadot" | "Kusama" | "Unknown";
}

export interface MultisigInfo {
  members: MultisigMember[];
  threshold: number;
}

export class MultisigService {
    private subscanApiKey: string;
  private cache: Map<string, MultisigMember[]> = new Map();
  private thresholdCache: Map<string, number> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_THRESHOLD = parseInt(process.env.MULTISIG_THRESHOLD || '4');

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

  /**
   * Constructor - accepts optional subscanApiKey parameter
   * If not provided, reads from environment variable
   * @param subscanApiKey - Optional Subscan API key
   */
    constructor(subscanApiKey?: string) {
        this.subscanApiKey = subscanApiKey || process.env.SUBSCAN_API_KEY || '';

        if (!this.subscanApiKey) {
      logger.warn('SUBSCAN_API_KEY not configured - multisig member fetching will be limited');
        }
    }

    /**
   * Get cached team members for a multisig address, refreshing if expired
   * @param multisigAddress - The multisig address to fetch members for
   * @param network - The network (Polkadot or Kusama)
   */
  async getCachedTeamMembers(multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigMember[]> {
    const cacheKey = `members_${network}_${multisigAddress}`;
    const now = Date.now();
    const expiry = this.cacheExpiry.get(cacheKey) || 0;

    if (this.cache.has(cacheKey) && now < expiry) {
      const cachedMembers = this.cache.get(cacheKey) || [];
      logger.debug({ network, multisigAddress, memberCount: cachedMembers.length }, 'Using cached team members');
      return cachedMembers;
    }

    logger.info({ network, multisigAddress }, 'Cache miss or expired, fetching fresh team members from Subscan');
    const members = await this.fetchMultisigMembers(multisigAddress, network);
    
    if (members.length > 0) {
      this.cache.set(cacheKey, members);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      logger.info({ network, multisigAddress, memberCount: members.length }, 'Team members cached successfully');
    } else {
      logger.warn({ network, multisigAddress }, 'No members returned from Subscan - cache not updated');
    }
    
    return members;
  }

  /**
   * Get multisig approval threshold
   * Returns cached threshold from API or falls back to environment variable/default
   * @param multisigAddress - The multisig address
   * @param network - The network (Polkadot or Kusama)
   */
  async getMultisigThreshold(multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<number> {
    // Ensure members are cached (which also caches threshold if available)
    await this.getCachedTeamMembers(multisigAddress, network);
    
    const cacheKey = `threshold_${network}_${multisigAddress}`;
    const cachedThreshold = this.thresholdCache.get(cacheKey);
    
    if (cachedThreshold) {
      logger.info({ network, multisigAddress, threshold: cachedThreshold, source: 'api' }, 'Using threshold from API');
      return cachedThreshold;
    }
    
    logger.info({ network, multisigAddress, threshold: this.DEFAULT_THRESHOLD, source: 'env/default' }, 'Using threshold from environment variable or default');
    return this.DEFAULT_THRESHOLD;
  }

  /**
   * Get complete multisig info including members and threshold
   * @param multisigAddress - The multisig address
   * @param network - The network (Polkadot or Kusama)
   */
  async getMultisigInfo(multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigInfo> {
    const members = await this.getCachedTeamMembers(multisigAddress, network);
    const threshold = await this.getMultisigThreshold(multisigAddress, network);
    
    return {
      members,
      threshold
    };
  }

  /**
   * Convert address to network-specific SS58 format
   * Polkadot: prefix 0, Kusama: prefix 2
   */
  private convertAddressToNetworkFormat(address: string, network: "Polkadot" | "Kusama"): string {
    try {
      const publicKey = decodeAddress(address);
      const ss58Prefix = network === "Kusama" ? 2 : 0;
      return encodeAddress(publicKey, ss58Prefix);
    } catch (error) {
      logger.warn({ address, network, error: formatError(error) }, 'Failed to convert address to network format');
      return address; // Return original if conversion fails
    }
  }

  /**
   * Get the correct Subscan endpoint for the network
   * Polkadot uses AssetHub, Kusama uses relay chain
   */
  private getSubscanEndpoint(network: "Polkadot" | "Kusama"): string {
    if (network === "Kusama") {
      return `https://kusama.api.subscan.io`;
    }
    return `https://assethub-polkadot.api.subscan.io`;
  }

  /**
   * Make a Subscan API request with retry logic for rate limiting
   */
  private async subscanRequestWithRetry<T = any>(
    url: string, 
    data: any, 
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await axios.post(url, data, {
          headers: {
            'X-API-Key': this.subscanApiKey,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error: any) {
        const isRateLimited = error.response?.status === 429;
        const isLastAttempt = attempt === maxRetries - 1;
        
        if (isRateLimited && !isLastAttempt) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          logger.warn({ 
            attempt: attempt + 1, 
            maxRetries, 
            delay,
            url 
          }, 'Rate limited by Subscan, retrying after delay...');
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }

  /**
   * Check if a multisig address is a proxy/delegate and extract parent address
   * @param multisigAddress - The multisig address to check
   * @param network - The network (Polkadot or Kusama)
   */
  async getParentAddress(multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<{ isProxy: boolean; parentAddress?: string; currentAddress: string; network: string }> {
    if (!multisigAddress || !this.subscanApiKey) {
      return {
        isProxy: false,
        currentAddress: multisigAddress,
        network
      };
    }

    try {
      const endpoint = this.getSubscanEndpoint(network);
      const responseData = await this.subscanRequestWithRetry(
        `${endpoint}/api/v2/scan/search`,
        { key: multisigAddress }
      );

      if (responseData.code === 0 && responseData.data?.account) {
        const accountData = responseData.data.account;
        
        // Check for proxy structure (proxy_account means this address delegates to others)
        if (accountData.proxy?.proxy_account && accountData.proxy.proxy_account.length > 0) {
          const proxyAccountAddress = accountData.proxy.proxy_account[0]?.account_display?.address;
          if (proxyAccountAddress) {
            logger.info({ 
              network, 
              currentAddress: multisigAddress,
              parentAddress: proxyAccountAddress,
              isProxy: true
            }, 'Found proxy account with delegated address');
            
            return {
              isProxy: true,
              parentAddress: proxyAccountAddress,
              currentAddress: multisigAddress,
              network
            };
          }
        }
        
        // Fallback: Check for delegate structure (conviction voting delegates)
        if (accountData.delegate?.conviction_delegated) {
          for (const entry of accountData.delegate.conviction_delegated) {
            if (entry.delegate_account?.people?.parent?.address) {
              const parentAddress = entry.delegate_account.people.parent.address;
              
              logger.info({ 
                network, 
                currentAddress: multisigAddress,
                parentAddress,
                isProxy: true
              }, 'Found delegate account with parent address');
              
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
      logger.error({ error: formatError(error), network, multisigAddress }, 'Error checking if address is proxy');
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
   * @param multisigAddress - The multisig address to fetch members for
   * @param network - The network (Polkadot or Kusama)
   */
  private async fetchMultisigMembers(multisigAddress: string, network: "Polkadot" | "Kusama"): Promise<MultisigMember[]> {
    if (!multisigAddress || !this.subscanApiKey) {
      logger.warn({ network, hasAddress: !!multisigAddress, hasApiKey: !!this.subscanApiKey }, 
        'Cannot fetch multisig members - missing configuration');
      return [];
    }

    try {
      const parentInfo = await this.getParentAddress(multisigAddress, network);
      
      let targetAddress = multisigAddress;
      if (parentInfo.isProxy && parentInfo.parentAddress) {
        targetAddress = parentInfo.parentAddress;
      }

      const endpoint = this.getSubscanEndpoint(network);
      const responseData = await this.subscanRequestWithRetry(
        `${endpoint}/api/v2/scan/search`,
        { key: targetAddress }
      );

      if (responseData.code === 0 && responseData.data?.account) {
        const accountData = responseData.data.account;
        const members: MultisigMember[] = [];

        if (accountData.delegate?.conviction_delegated) {
          for (const entry of accountData.delegate.conviction_delegated) {
            if (entry.account?.address) {
              const displayName = entry.account.people?.display || entry.account.display_name || entry.account.name || null;
              
              // Convert address to network-specific format
              const convertedAddress = this.convertAddressToNetworkFormat(entry.account.address, network);
              
              members.push({
                wallet_address: convertedAddress,
                team_member_name: displayName || 'Unknown',
                network: network
              });
            }
          }
          
          logger.info({ network, targetAddress, membersCount: members.length }, 'Successfully extracted members from delegate account');
          return members;
        }

        if (accountData.multisig?.multi_account_member) {
          // Extract threshold if available
          const threshold = accountData.multisig.threshold || accountData.multisig.threshold_value;
          if (threshold) {
            const cacheKey = `threshold_${network}_${multisigAddress}`;
            this.thresholdCache.set(cacheKey, parseInt(threshold));
          }
          
          for (const entry of accountData.multisig.multi_account_member) {
            if (entry.address) {
              const displayName = entry.people?.display || entry.display_name || entry.name || entry.display || null;
              
              // Convert address to network-specific format
              const convertedAddress = this.convertAddressToNetworkFormat(entry.address, network);
              
              members.push({
                wallet_address: convertedAddress,
                team_member_name: displayName || 'Unknown',
                network: network
              });
            }
          }
          
          logger.info({ network, targetAddress, membersCount: members.length, threshold }, 'Successfully extracted members from direct multisig account');
          return members;
        }

        logger.warn({ network, targetAddress }, 'No multisig or delegate data found in account');
        return [];

      } else {
        logger.warn({ network, targetAddress, responseCode: responseData.code }, 'Subscan API returned error or no data');
        return [];
      }

    } catch (error) {
      logger.error({ error: formatError(error), network, multisigAddress }, 'Error fetching multisig members');
      return [];
    }
  }

  /**
   * Check if a wallet address is a multisig member
   * @param walletAddress - The wallet address to check
   * @param multisigAddress - The multisig address
   * @param network - The network (Polkadot or Kusama)
   */
  async isTeamMember(walletAddress: string, multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<boolean> {
    const members = await this.getCachedTeamMembers(multisigAddress, network);
    
    // Try exact match first
    let isMember = members.some(member => member.wallet_address === walletAddress);
    if (isMember) return true;
    
    // If no exact match, try the converted network-specific address
    const networkAddress = this.convertToNetworkAddress(walletAddress, network);
    isMember = members.some(member => member.wallet_address === networkAddress);
    if (isMember) return true;
    
    // If still no match, try case-insensitive and trimmed comparison
    const normalizedWalletAddress = walletAddress.trim().toLowerCase();
    isMember = members.some(member => 
      member.wallet_address.trim().toLowerCase() === normalizedWalletAddress
    );
    if (isMember) return true;
    
    // Try comparing raw public keys (works across all address formats)
    try {
      const walletPublicKey = decodeAddress(walletAddress);
      const walletPublicKeyHex = Buffer.from(walletPublicKey).toString('hex');
      
      for (const member of members) {
        try {
          const memberPublicKey = decodeAddress(member.wallet_address);
          const memberPublicKeyHex = Buffer.from(memberPublicKey).toString('hex');
          
          if (walletPublicKeyHex === memberPublicKeyHex) {
            return true;
          }
        } catch (memberDecodeError) {
          continue;
        }
      }
    } catch (walletDecodeError) {
      logger.warn({ walletAddress }, 'Failed to decode wallet address for public key comparison');
    }
    
    return false;
  }

  /**
   * Get multisig member info by wallet address
   * @param walletAddress - The wallet address to look up
   * @param multisigAddress - The multisig address
   * @param network - The network (Polkadot or Kusama)
   */
  async getTeamMemberByAddress(walletAddress: string, multisigAddress: string, network: "Polkadot" | "Kusama" = "Polkadot"): Promise<MultisigMember | null> {
    const members = await this.getCachedTeamMembers(multisigAddress, network);
    
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
// Uses environment variable SUBSCAN_API_KEY
export const multisigService = new MultisigService(); 