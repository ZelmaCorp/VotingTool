import { Chain, TimelineStatus } from "./types/properties";
import { fetchDataFromAPI, fetchReferendumContent } from "./polkAssembly/fetchReferendas";
import { fetchDotToUsdRate, fetchKusToUsdRate, calculateReward, getValidatedOrigin, getValidatedStatus } from "./utils/utils";
import { createSubsystemLogger, formatError } from "./config/logger";
import { Subsystem } from "./types/logging";
import { Referendum } from "./database/models/referendum";
import { ReferendumRecord } from "./database/types";
import { InternalStatus } from "./types/properties";
import { db } from "./database/connection";
import { VOTE_OVER_STATUSES, VOTED_STATUSES } from "./utils/constants";

// Version will be injected by build script
// Fallback version for development
let APP_VERSION = "2.0.0-fallback";

const logger = createSubsystemLogger(Subsystem.REFRESH);

// Add concurrency protection flag
let isRefreshing = false;

/**
 * Creates a new referendum record in the database from Polkassembly data
 */
async function createReferendumFromPolkassembly(referenda: any, exchangeRate: number, network: Chain): Promise<void> {
    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const requestedAmountUsd = calculateReward(contentResp, exchangeRate, network);

    const referendumData: ReferendumRecord = {
        post_id: referenda.post_id,
        chain: network,
        title: referenda.title || `Referendum #${referenda.post_id}`,
        description: contentResp.content || referenda.description,
        requested_amount_usd: requestedAmountUsd,
        origin: getValidatedOrigin(referenda.origin),
        referendum_timeline: getValidatedStatus(referenda.status),
        internal_status: InternalStatus.NotStarted,
        link: `https://${referenda.network.toLowerCase()}.polkassembly.io/referenda/${referenda.post_id}`,
        voting_start_date: referenda.created_at,
        created_at: new Date().toISOString()
    };

    await Referendum.create(referendumData);
}

/**
 * Updates an existing referendum record in the database with latest data from Polkassembly
 */
async function updateReferendumFromPolkassembly(referenda: any, exchangeRate: number, network: Chain): Promise<void> {
    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const requestedAmountUsd = calculateReward(contentResp, exchangeRate, network);
    const newTimelineStatus = getValidatedStatus(referenda.status);

    const updates: Partial<ReferendumRecord> = {
        title: contentResp.title || referenda.title || `Referendum #${referenda.post_id}`, // Use detail API title (updated) over list API title (cached)
        description: contentResp.content || referenda.description,
        requested_amount_usd: requestedAmountUsd,
        referendum_timeline: newTimelineStatus
    };

    await Referendum.update(referenda.post_id, network, updates);
}

/**
 * Check all existing referendums in database and auto-transition to NotVoted if needed.
 * This runs after each refresh to mark any referendums where the vote is over but the DAO hasn't voted.
 */
export async function checkAllReferendumsForNotVoted(): Promise<void> {
    try {
        logger.info('Checking all referendums in database for NotVoted auto-transition');
        
        // Build the SQL query dynamically based on the constants
        const voteOverPlaceholders = VOTE_OVER_STATUSES.map(() => '?').join(', ');
        const votedStatusesWithNotVoted = [...VOTED_STATUSES, InternalStatus.NotVoted];
        const statusPlaceholders = votedStatusesWithNotVoted.map(() => '?').join(', ');
        
        // Get all referendums that have a vote-over status but haven't been marked as voted or NotVoted
        const referendums = await db.all(
            `SELECT id, post_id, chain, internal_status, referendum_timeline 
             FROM referendums 
             WHERE referendum_timeline IN (${voteOverPlaceholders})
             AND internal_status NOT IN (${statusPlaceholders})`,
            [
                ...VOTE_OVER_STATUSES,
                ...votedStatusesWithNotVoted
            ]
        ) as ReferendumRecord[];
        
        logger.info({ count: referendums.length }, 'Found referendums that need NotVoted transition');
        
        for (const referendum of referendums) {
            logger.info(
                { 
                    postId: referendum.post_id, 
                    chain: referendum.chain,
                    currentStatus: referendum.internal_status,
                    timelineStatus: referendum.referendum_timeline
                }, 
                'Auto-transitioning to NotVoted: vote is over and DAO has not voted'
            );
            
            await db.run(
                `UPDATE referendums 
                 SET internal_status = ?, updated_at = datetime('now') 
                 WHERE id = ?`,
                [InternalStatus.NotVoted, referendum.id]
            );
        }
    } catch (error) {
        logger.error({ error: formatError(error) }, 'Error checking referendums for NotVoted transition');
    }
}

/**
 * Refreshes referendum data from Polkassembly API and syncs with SQLite database.
 * Fetches referendas from both Polkadot and Kusama networks, gets exchange rates,
 * and creates/updates corresponding database records.
 * 
 * @param limit - Maximum number of posts to fetch from each network (default: 30)
 */
export async function refreshReferendas(limit: number = 30) {
    
    // Prevent concurrent refresh operations
    if (isRefreshing) {
        logger.debug('Previous refreshReferendas operation still running, skipping...');
        return;
    }

    try {
        isRefreshing = true;
        logger.info({ limit, version: APP_VERSION }, `Refreshing Referendas v${APP_VERSION}...`)

        // Fetch latest proposals from both networks and fetch exchange rates
        const [polkadotPosts, kusamaPosts, dotUsdRate, kusUsdRate] = await Promise.all([
            fetchDataFromAPI(limit, Chain.Polkadot),
            fetchDataFromAPI(limit, Chain.Kusama),
            fetchDotToUsdRate(),
            fetchKusToUsdRate()
        ]);

        // Combine them into one array
        const referendas = [...polkadotPosts.referendas, ...kusamaPosts.referendas];
        logger.info({ 
            polkadotCount: polkadotPosts.referendas.length,
            kusamaCount: kusamaPosts.referendas.length,
            totalCount: referendas.length
        }, "Fetched referendas from both networks");

        // Go through the fetched referendas
        for (const referenda of referendas) {
            // Check if referendum exists in database
            const found = await Referendum.findByPostIdAndChain(referenda.post_id, referenda.network);
            const exchangeRate = referenda.network === Chain.Polkadot ? dotUsdRate : kusUsdRate;

            if (found) {
                logger.info({ postId: referenda.post_id, network: referenda.network }, `Referendum found in database, updating`);
                try {
                    await updateReferendumFromPolkassembly(referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: formatError(error), network: referenda.network }, "Error updating referendum");
                }
            } else {
                logger.info({ postId: referenda.post_id, network: referenda.network }, `Referendum not in database, creating new record`);
                try {
                    await createReferendumFromPolkassembly(referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: formatError(error), network: referenda.network }, "Error creating referendum");
                }
            }
        }
        
        // After refreshing recent referendums, check ALL referendums in database for NotVoted transition
        await checkAllReferendumsForNotVoted();
        
    } catch (error) {
        logger.error({ error: formatError(error) }, "Error while refreshing Referendas");
    } finally {
        isRefreshing = false;
    }
}