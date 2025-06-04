import { Chain, Origin, TimelineStatus } from "../types/properties";


export function getValidatedOrigin(origin: string | undefined): Origin {
    if (!origin) return  Origin.NoOriginInformationAvailable;

    if (Object.values(Origin).includes(origin as Origin)) {
      return origin as Origin;
    }
  
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}

export function getValidatedStatus(status: string | undefined): TimelineStatus {
    if (!status) throw new Error("No VoteStatus found");            // probably return some default value, but this way we are not saying incorrect things

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
            // Use statusText if available, otherwise a generic message
            const errorText = response.statusText || `HTTP error! status: ${response.status}`;
            throw new Error(`Error fetching DOT/USD rate: ${errorText}`);
        }
        const data = await response.json();
        // Safely access nested properties
        if (data && data.polkadot && typeof data.polkadot.usd === 'number') {
            return data.polkadot.usd;
        }
        console.error('Error fetching DOT/USD rate: Invalid data structure received from CoinGecko', data);
        return 0; // Return 0 if structure is not as expected
    } catch (error) {
        // Log the original error if it's not the one we constructed for !response.ok
        if (!(error instanceof Error && error.message.startsWith('Error fetching DOT/USD rate:'))) {
             console.error('Error fetching DOT/USD rate:', (error as any).message);
        }
        // If the error was thrown due to !response.ok or JSON parsing, rethrow it.
        // Otherwise, for unexpected data structure, we've logged and returned 0.
        // The test for unexpected data structure expects a return of 0, not a throw.
        // For other errors (network, etc.), they should be thrown.
        if (error instanceof Error && error.message.startsWith('Error fetching DOT/USD rate:')) {
            throw error; // Rethrow errors from !response.ok or other explicit throws
        }
        // For TypeErrors from data structure issues if not caught by the if block, or other unexpected errors
        // we need to decide if we rethrow or return 0. The tests for missing structure expect 0.
        // The original code re-threw. For now, let's ensure it returns 0 for data structure issues.
        // The specific test `should return 0 if the expected data structure is missing` implies this.
        // If it was a genuine network error or JSON parse error, it would have been caught/thrown earlier.
        // So if we reach here and it wasn't an explicit throw from `!response.ok`, it implies a data structure problem
        // or an issue within the try block after fetching. The safe access above should prevent most TypeErrors though.
        // Let's assume errors making it here, not explicitly thrown by us, are caught by tests expecting throws.
        // The tests for returning 0 are for specific data structure issues.
        if (error instanceof TypeError) { // specifically catch type errors from bad data access
            // This might be redundant if the safe access is perfect, but acts as a fallback
            console.error('TypeError during DOT/USD rate processing:', (error as any).message);
            return 0; 
        }
        throw error; // Rethrow other types of errors (e.g. network failure if fetch itself fails)
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
            return data.kusama.usd;
        }
        console.error('Error fetching KSM/USD rate: Invalid data structure received from CoinGecko', data);
        return 0;
    } catch (error) {
        if (!(error instanceof Error && error.message.startsWith('Error fetching KSM/USD rate:'))) {
            console.error('Error fetching KSM/USD rate:', (error as any).message);
        }
        if (error instanceof Error && error.message.startsWith('Error fetching KSM/USD rate:')) {
            throw error;
        }
        if (error instanceof TypeError) {
             console.error('TypeError during KSM/USD rate processing:', (error as any).message);
            return 0;
        }
        throw error;
    }
}

/** Calculate requested amount (in $) */ 
export function calculateReward(content: any, rate: number,  network: Chain): number {

    if (content.beneficiaries && content.beneficiaries.length > 0) {
        const beneficiary = content.beneficiaries[0];
        if (content.assetId === '1984' || content.assetId === '1337') {
            const usdtAmount = Number((BigInt(beneficiary.amount) / BigInt(1e6)).toString());

            console.log(`${usdtAmount} ${assetIdToTicker(content.assetId)}`);
            return usdtAmount;
        }
    }
    
    if (content.proposer && content.requested) {
        let nativeAmount = BigInt(0);
        if (network === Chain.Polkadot) nativeAmount = BigInt(content.requested) / BigInt(1e10);
        if (network === Chain.Kusama) nativeAmount = BigInt(content.requested) / BigInt(1e12);

        // Convert to number first to preserve decimals
        const nativeValue = Number(nativeAmount);
        const usdValue = nativeValue * rate;

        console.log(`$${usdValue} USD`);
        return usdValue;
    }
    
    console.log('No reward information available');
    return 0;
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