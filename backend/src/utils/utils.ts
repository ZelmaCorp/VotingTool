import { Chain, Origin, TimelineStatus } from "../types/properties";
import { priceCache } from './priceCache';
import { createSubsystemLogger, logError, formatError } from '../config/logger';
import { Subsystem, ErrorType } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.UTILS);


/** Origin has to be on the enum, otherwise throw an error. */
export function getValidatedOrigin(origin: string | undefined): Origin {
    if (!origin) return  Origin.NoOriginInformationAvailable;

    if (Object.values(Origin).includes(origin as Origin)) {
      return origin as Origin;
    }
  
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}

/** Status has to be on the enum, otherwise throw an error. */
export function getValidatedStatus(status: string | undefined): TimelineStatus {
    if (!status) throw new Error("No VoteStatus found");  
    
    if (Object.values(TimelineStatus).includes(status as TimelineStatus)) {
        return status as TimelineStatus;
    }

    throw new Error(`Invalid vote status: ${status}`);
}

/** Helper function to validate exchange rate */
function isValidRate(rate: number): boolean {
    // Rate should be positive and within reasonable bounds
    // DOT typically ranges from $1-50, KSM from $10-500
    return rate > 0.1 && rate < 100000;
}

/** Fetch DOT/USD exchange rate. Will also save it to the priceCache.
 *  If API call fails, will fallback to cached value.
 */
export async function fetchDotToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
        if (!response.ok) {
            const errorText = response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(`Error fetching DOT/USD rate: ${errorText}`);
        }
        const data = await response.json();
      
        if (data && data.polkadot && typeof data.polkadot.usd === 'number' && isValidRate(data.polkadot.usd)) {
            const rate = data.polkadot.usd;
            priceCache.setPrice(Chain.Polkadot, rate);
            logger.info({ rate }, 'Successfully fetched and cached DOT/USD rate');
            return rate;
        }
        
        // Invalid rate received, fallback to cache
        logger.error({ 
            error: `Invalid rate: ${data?.polkadot?.usd}`,
            data,
            rate: data?.polkadot?.usd 
        }, 'Invalid DOT/USD rate received from CoinGecko, using cached value');
        
        const cachedRate = priceCache.getPrice(Chain.Polkadot);
        if (cachedRate && isValidRate(cachedRate)) {
            return cachedRate;
        }
        
        throw new Error('No valid DOT/USD rate available (API returned invalid data and no cached value)');
        
    } catch (error) {
        if (!(error instanceof Error && error.message.startsWith('Error fetching DOT/USD rate:'))) {
             logger.error({ error: formatError(error) }, 'Error fetching DOT/USD rate');
        }
        
        const cachedRate = priceCache.getPrice(Chain.Polkadot);
        if (cachedRate && isValidRate(cachedRate)) {
            return cachedRate;
        }
        
        throw new Error('No valid DOT/USD rate available (API error and no cached value)');
    }
}

/** Fetch KSM/USD exchange rate. Will also save it to the priceCache.
 *  If API call fails, will fallback to cached value.
 */
export async function fetchKusToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
        if (!response.ok) {
            const errorText = response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(`Error fetching KSM/USD rate: ${errorText}`);
        }
        const data = await response.json();
        
        if (data && data.kusama && typeof data.kusama.usd === 'number' && isValidRate(data.kusama.usd)) {
            const rate = data.kusama.usd;
            priceCache.setPrice(Chain.Kusama, rate);
            logger.info({ rate }, 'Successfully fetched and cached KSM/USD rate');
            return rate;
        }
        
        // Invalid rate received, fallback to cache
        logger.error({ 
            error: `Invalid rate: ${data?.kusama?.usd}`,
            data,
            rate: data?.kusama?.usd 
        }, 'Invalid KSM/USD rate received from CoinGecko, using cached value');
        
        const cachedRate = priceCache.getPrice(Chain.Kusama);
        if (cachedRate && isValidRate(cachedRate)) {
            return cachedRate;
        }
        
        throw new Error('No valid KSM/USD rate available (API returned invalid data and no cached value)');
        
    } catch (error) {
        if (!(error instanceof Error && error.message.startsWith('Error fetching KSM/USD rate:'))) {
            logger.error({ error: formatError(error) }, 'Error fetching KSM/USD rate');
        }
        
        const cachedRate = priceCache.getPrice(Chain.Kusama);
        if (cachedRate && isValidRate(cachedRate)) {
            return cachedRate;
        }
        
        throw new Error('No valid KSM/USD rate available (API error and no cached value)');
    }
}

/**
 * Calculates the USD value of a reward based on the content, exchange rate, and network.
 * 
 * @param content - The content of the referendum
 * @param rate - The exchange rate for the network
 * @param network - The blockchain network (Polkadot or Kusama)
 * @returns The USD value of the reward
 */
export function calculateReward(content: any, rate: number, network: Chain): number {
    let totalUsdValue = 0;
    let hasUnknownFormat = false;

    // Check for beneficiaries with stablecoin or native token requests
    if (content.beneficiaries && content.beneficiaries.length > 0) {
        for (const beneficiary of content.beneficiaries) {
            // Check both possible locations for asset ID
            const assetId = content.assetId || beneficiary.genralIndex;
            
            if (assetId === '1984' || assetId === '1337') {
                // USDT/USDC amount (6 decimals)
                const usdtAmount = Number((BigInt(beneficiary.amount) / BigInt(1e6)).toString());
                logger.debug({ usdtAmount, assetId, ticker: assetIdToTicker(assetId) }, `Calculated stablecoin reward`);
                totalUsdValue += usdtAmount;
            } else if (!assetId) {
                // Native token amount (DOT/KSM)
                try {
                    let nativeAmount = BigInt(0);
                    if (network === Chain.Polkadot) {
                        nativeAmount = BigInt(beneficiary.amount) / BigInt(1e10);
                    } else if (network === Chain.Kusama) {
                        nativeAmount = BigInt(beneficiary.amount) / BigInt(1e12);
                    }
                    
                    const nativeValue = Number(nativeAmount);
                    const usdValue = nativeValue * rate;
                    logger.debug({ nativeValue, network, usdValue, rate }, `Calculated native token reward`);
                    totalUsdValue += usdValue;
                } catch (error) {
                    logError(logger, { error, beneficiary }, 'Malformed native token amount', ErrorType.MALFORMED_AMOUNT);
                    hasUnknownFormat = true;
                }
            } else {
                // Unknown asset ID format
                logger.warn({ assetId }, `Unknown asset ID`);
                hasUnknownFormat = true;
            }
        }
    } else if (content.proposer && content.requested && typeof content.requested === 'string') {
        // Legacy format for native token requests
        try {
            let nativeAmount = BigInt(0);
            if (network === Chain.Polkadot) {
                nativeAmount = BigInt(content.requested) / BigInt(1e10);
            } else if (network === Chain.Kusama) {
                nativeAmount = BigInt(content.requested) / BigInt(1e12);
            }

            const nativeValue = Number(nativeAmount);
            const usdValue = nativeValue * rate;
            logger.debug({ nativeValue, network, usdValue, rate }, `Calculated legacy native token reward`);
            totalUsdValue = usdValue;
        } catch (error) {
            logError(logger, { error, requestedAmount: content.requested }, 'Malformed native token request', ErrorType.MALFORMED_AMOUNT);
            hasUnknownFormat = true;
        }
    } else if (content.beneficiaries?.length > 0 || content.requested) {
        // Has reward-related fields but in unknown format - this is critical
        logError(logger, { content }, 'Unknown reward format', ErrorType.UNKNOWN_REWARD_FORMAT);
        hasUnknownFormat = true;
    } else {
        // No reward information at all
        logger.debug('No reward information available');
        return 0;
    }


    // Return 0 if we encountered any unknown formats, otherwise return the total USD value
    return hasUnknownFormat ? 0 : totalUsdValue;
}

function assetIdToTicker(assetId: string): string {
    if (assetId === '1337') return 'USDC';
    if (assetId === '1984') return 'USDT';
    //throw "Unknown AssetId";
    return 'NaN';
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

