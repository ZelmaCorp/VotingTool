import { Chain, Origin, TimelineStatus } from "../types/properties";
import { priceCache } from './priceCache';


export function getValidatedOrigin(origin: string | undefined): Origin {
    if (!origin) return  Origin.NoOriginInformationAvailable;

    if (Object.values(Origin).includes(origin as Origin)) {
      return origin as Origin;
    }
  
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}

export function getValidatedStatus(status: string | undefined): TimelineStatus {
    if (!status) throw new Error("No VoteStatus found");  
    
    if (Object.values(TimelineStatus).includes(status as TimelineStatus)) {
        return status as TimelineStatus;
    }

    throw new Error(`Invalid vote status: ${status}`);
}

/** Fetch DOT/USD exchange rate */
export async function fetchDotToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
        if (!response.ok) {
            const errorText = response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(`Error fetching DOT/USD rate: ${errorText}`);
        }
        const data = await response.json();
      
        if (data && data.polkadot && typeof data.polkadot.usd === 'number') {
            const rate = data.polkadot.usd;
            priceCache.setPrice(Chain.Polkadot, rate);
            return rate;
        }
        console.error('Error fetching DOT/USD rate: Invalid data structure received from CoinGecko', data);
        return priceCache.getPrice(Chain.Polkadot);
    } catch (error) {
        if (!(error instanceof Error && error.message.startsWith('Error fetching DOT/USD rate:'))) {
             console.error('Error fetching DOT/USD rate:', (error as any).message);
        }
        return priceCache.getPrice(Chain.Polkadot);
    }
}

/** Fetch KUS/USD exchange rate */
export async function fetchKusToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
        if (!response.ok) {
            const errorText = response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(`Error fetching KSM/USD rate: ${errorText}`);
        }
        const data = await response.json();
        if (data && data.kusama && typeof data.kusama.usd === 'number') {
            const rate = data.kusama.usd;
            priceCache.setPrice(Chain.Kusama, rate);
            return rate;
        }
        console.error('Error fetching KSM/USD rate: Invalid data structure received from CoinGecko', data);
        return priceCache.getPrice(Chain.Kusama);
    } catch (error) {
        if (!(error instanceof Error && error.message.startsWith('Error fetching KSM/USD rate:'))) {
            console.error('Error fetching KSM/USD rate:', (error as any).message);
        }
        return priceCache.getPrice(Chain.Kusama);
    }
}

/** Calculate requested amount (in $) */ 
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
                console.log(`${usdtAmount} ${assetIdToTicker(assetId)}`);
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
                    console.log(`${nativeValue} ${network} ($${usdValue} USD)`);
                    totalUsdValue += usdValue;
                } catch (error) {
                    console.log('Malformed native token amount:', error);
                    hasUnknownFormat = true;
                }
            } else {
                // Unknown asset ID format
                console.log(`Unknown asset ID: ${assetId}`);
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
            console.log(`${nativeValue} ${network} ($${usdValue} USD)`);
            totalUsdValue = usdValue;
        } catch (error) {
            console.log('Malformed native token request:', error);
            hasUnknownFormat = true;
        }
    } else if (content.beneficiaries?.length > 0 || content.requested) {
        // Has reward-related fields but in unknown format
        console.log('Unknown reward format');
        hasUnknownFormat = true;
    } else {
        // No reward information at all
        console.log('No reward information available');
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

export async function waitUntilStartMinute(): Promise<void> {
    const startMinute = process.env.START_MINUTE ? parseInt(process.env.START_MINUTE, 10) : 0;
    const now = new Date();
    const currentMinute = now.getMinutes();
    
    let waitTime = 0;
    
    if (currentMinute !== startMinute) {
        waitTime = ((startMinute - currentMinute + 60) % 60) * 60 * 1000; // Convert to milliseconds
        console.log(`Waiting ${waitTime / 1000} seconds until START_MINUTE (${startMinute})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    console.log(`Reached START_MINUTE: ${startMinute}, proceeding...`);
}