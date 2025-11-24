import { Chain, TimelineStatus } from "./types/properties";
import { fetchDataFromAPI, fetchReferendumContent } from "./polkAssembly/fetchReferendas";
import { fetchDotToUsdRate, fetchKusToUsdRate, calculateReward, getValidatedOrigin, getValidatedStatus } from "./utils/utils";
import { createSubsystemLogger, formatError } from "./config/logger";
import { Subsystem } from "./types/logging";
import { Referendum } from "./database/models/referendum";
import { ReferendumRecord } from "./database/types";
import { InternalStatus } from "./types/properties";
import { db } from "./database/connection";
import { VOTE_OVER_STATUSES, VOTED_STATUSES, TERMINAL_STATUSES } from "./utils/constants";

// Version will be injected by build script
// Fallback version for development
let APP_VERSION = "2.0.0-fallback";

const logger = createSubsystemLogger(Subsystem.REFRESH);

// Add concurrency protection flag
let isRefreshing = false;

/**
 * Helper function to create a unique key for a referendum
 * @param postId - The referendum post ID
 * @param chain - The chain (Polkadot or Kusama)
 * @returns A unique key string in format "postId-chain"
 */
function makeRefKey(postId: number, chain: Chain): string {
    return `${postId}-${chain}`;
}

/**
 * Fetch the current status of a referendum from the detail API
 * Prefers the detail API status over fallback status as it's more current
 * @param postId - The referendum post ID
 * @param chain - The chain (Polkadot or Kusama)
 * @param fallbackStatus - Optional fallback status if detail API doesn't provide one
 * @returns The validated TimelineStatus
 */
async function fetchCurrentStatus(postId: number, chain: Chain, fallbackStatus?: string): Promise<TimelineStatus> {
    const contentResp = await fetchReferendumContent(postId, chain);
    const statusFromDetailApi = contentResp.status || contentResp.timeline?.[0]?.status;
    const timelineStatus = statusFromDetailApi || fallbackStatus;
    
    // Log when we detect a status discrepancy
    if (statusFromDetailApi && fallbackStatus && statusFromDetailApi !== fallbackStatus) {
        logger.info(
            `Status discrepancy for referendum ${postId} (${chain}): List API says '${fallbackStatus}', Detail API says '${statusFromDetailApi}' - using Detail API status`
        );
    }
    
    if (!timelineStatus) {
        throw new Error(`No status available for referendum ${postId} on ${chain}`);
    }
    
    return getValidatedStatus(timelineStatus);
}

/**
 * Creates a new referendum record in the database from Polkassembly data
 */
async function createReferendumFromPolkassembly(referenda: any, exchangeRate: number, network: Chain, daoId: number): Promise<void> {
    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const requestedAmountUsd = calculateReward(contentResp, exchangeRate, network);

    const referendumData: ReferendumRecord = {
        post_id: referenda.post_id,
        chain: network,
        dao_id: daoId,
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
async function updateReferendumFromPolkassembly(referenda: any, exchangeRate: number, network: Chain, daoId: number): Promise<void> {
    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const requestedAmountUsd = calculateReward(contentResp, exchangeRate, network);
    
    // Fetch current status (prefers detail API over list API)
    const newTimelineStatus = await fetchCurrentStatus(referenda.post_id, network, referenda.status);

    const updates: Partial<ReferendumRecord> = {
        title: contentResp.title || referenda.title || `Referendum #${referenda.post_id}`, // Use detail API title (updated) over list API title (cached)
        description: contentResp.content || referenda.description,
        requested_amount_usd: requestedAmountUsd,
        referendum_timeline: newTimelineStatus
    };

    await Referendum.update(referenda.post_id, network, daoId, updates);
}

/**
 * Update all active referendums in database by fetching their current status from detail API.
 * This catches referendums that don't appear in the latest-activity feed but still need status updates.
 * @param skipRefs - Set of referendum keys (postId-chain) to skip (already updated from activity feed)
 */
export async function updateAllActiveReferendums(skipRefs: Set<string> = new Set()): Promise<void> {
    try {
        // Build SQL query with placeholders for all terminal statuses
        const terminalPlaceholders = TERMINAL_STATUSES.map(() => '?').join(', ');
        
        // Get all referendums that are NOT in terminal states
        const activeReferendums = await db.all(
            `SELECT post_id, chain, dao_id, referendum_timeline
             FROM referendums
             WHERE referendum_timeline NOT IN (${terminalPlaceholders})
             ORDER BY post_id DESC
             LIMIT 500`,
            TERMINAL_STATUSES
        ) as { post_id: number; chain: Chain; dao_id: number; referendum_timeline: string }[];

        const totalActive = activeReferendums.length;
        const skippedCount = skipRefs.size;
        
        logger.info(`Updating active referendums: ${totalActive} total, ${skippedCount} already updated from activity feed`);

        let checkedCount = 0;
        let skippedFromSet = 0;
        let changedCount = 0;

        for (const ref of activeReferendums) {
            const refKey = makeRefKey(ref.post_id, ref.chain);
            
            // Skip if already updated from activity feed
            if (skipRefs.has(refKey)) {
                skippedFromSet++;
                continue;
            }
            
            try {
                // Fetch current status from detail API
                const newTimelineStatus = await fetchCurrentStatus(ref.post_id, ref.chain, ref.referendum_timeline);
                
                // Update if status changed
                if (newTimelineStatus !== ref.referendum_timeline) {
                    logger.info(
                        `Updating referendum ${ref.post_id} (${ref.chain}): '${ref.referendum_timeline}' -> '${newTimelineStatus}'`
                    );
                    
                    await Referendum.update(ref.post_id, ref.chain, ref.dao_id, {
                        referendum_timeline: newTimelineStatus
                    });
                    
                    changedCount++;
                }
                checkedCount++;
            } catch (error) {
                logger.error({ 
                    postId: ref.post_id, 
                    chain: ref.chain, 
                    error: formatError(error) 
                }, "Error updating active referendum from detail API");
                // Continue with next referendum
            }
        }

        logger.info(`Completed active referendum update: checked ${checkedCount}, skipped ${skippedFromSet}, changed ${changedCount}`);
    } catch (error) {
        logger.error({ error: formatError(error) }, 'Error updating active referendums');
    }
}

/**
 * Check all existing referendums in database and auto-transition to NotVoted if needed.
 * This runs after each refresh to mark any referendums where the vote is over but the DAO hasn't voted.
 */
export async function checkAllReferendumsForNotVoted(): Promise<void> {
    try {
        logger.info({ 
            voteOverStatuses: VOTE_OVER_STATUSES,
            votedStatuses: VOTED_STATUSES 
        }, 'Checking all referendums in database for NotVoted auto-transition');
        
        // Build the SQL query dynamically based on the constants
        const voteOverPlaceholders = VOTE_OVER_STATUSES.map(() => '?').join(', ');
        const votedStatusesWithNotVoted = [...VOTED_STATUSES, InternalStatus.NotVoted];
        const statusPlaceholders = votedStatusesWithNotVoted.map(() => '?').join(', ');
        
        // First, let's see what referendums have vote-over statuses (for debugging)
        const allVoteOverReferendums = await db.all(
            `SELECT id, post_id, chain, internal_status, referendum_timeline 
             FROM referendums 
             WHERE referendum_timeline IN (${voteOverPlaceholders})`,
            [...VOTE_OVER_STATUSES]
        ) as ReferendumRecord[];
        
        logger.debug({ 
            count: allVoteOverReferendums.length,
            referendums: allVoteOverReferendums.map(r => ({
                postId: r.post_id,
                chain: r.chain,
                internalStatus: r.internal_status,
                timelineStatus: r.referendum_timeline
            }))
        }, 'All referendums with vote-over timeline status');
        
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
        
        logger.info(`Found ${referendums.length} referendums that need NotVoted transition`);
        
        let transitionedCount = 0;
        for (const referendum of referendums) {
            logger.info(
                `Auto-transitioning referendum ${referendum.post_id} (${referendum.chain}) to NotVoted: was '${referendum.internal_status}', vote status is '${referendum.referendum_timeline}'`
            );
            
            await db.run(
                `UPDATE referendums 
                 SET internal_status = ?, updated_at = datetime('now') 
                 WHERE id = ?`,
                [InternalStatus.NotVoted, referendum.id]
            );
            transitionedCount++;
        }
        
        logger.info(`Completed NotVoted auto-transition check: transitioned ${transitionedCount} referendums, ${allVoteOverReferendums.length} total with vote-over status`);
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
 * @param daoId - Optional: DAO ID to refresh for. If not provided, refreshes for all active DAOs (multi-DAO support)
 */
export async function refreshReferendas(limit: number = 30, daoId?: number) {
    
    // Prevent concurrent refresh operations
    if (isRefreshing) {
        logger.debug('Previous refreshReferendas operation still running, skipping...');
        return;
    }

    try {
        isRefreshing = true;
        logger.info({ limit, daoId, version: APP_VERSION }, `Refreshing Referendas v${APP_VERSION}...`)

        // Import DAO to get DAOs to refresh for
        const { DAO } = await import('./database/models/dao');
        
        // Determine which DAOs to refresh for  
        let daosToRefresh: Awaited<ReturnType<typeof DAO.getAll>> = [];
        
        if (daoId) {
            const dao = await DAO.getById(daoId);
            if (dao) {
                daosToRefresh = [dao];
            }
        } else {
            daosToRefresh = await DAO.getAll(true); // All active DAOs
        }

        if (daosToRefresh.length === 0) {
            logger.warn({ daoId }, 'No active DAOs found - skipping refresh. Create a DAO first.');
            return;
        }

        logger.info({ daoCount: daosToRefresh.length, daoIds: daosToRefresh.map(d => d.id) }, 
            `Refreshing for ${daosToRefresh.length} DAO(s)`);

        // Track which referendums we update from activity feed to avoid duplicate API calls
        const updatedRefs = new Set<string>();

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

        // Refresh referendums for each DAO
        for (const dao of daosToRefresh) {
            logger.info({ daoId: dao.id, daoName: dao.name }, `Processing referendums for DAO`);

            for (const referenda of referendas) {
                const exchangeRate = referenda.network === Chain.Polkadot ? dotUsdRate : kusUsdRate;
                
                // Check if referendum exists for this specific DAO
                const found = await Referendum.findByPostIdAndChain(referenda.post_id, referenda.network, dao.id);

                if (found) {
                    logger.debug({ postId: referenda.post_id, network: referenda.network, daoId: dao.id }, 
                        `Referendum found, updating`);
                    try {
                        await updateReferendumFromPolkassembly(referenda, exchangeRate, referenda.network, dao.id);
                    } catch (error) {
                        logger.error({ postId: referenda.post_id, daoId: dao.id, error: formatError(error), network: referenda.network }, 
                            "Error updating referendum");
                    }
                } else {
                    logger.debug({ postId: referenda.post_id, network: referenda.network, daoId: dao.id }, 
                        `Referendum not found, creating`);
                    try {
                        await createReferendumFromPolkassembly(referenda, exchangeRate, referenda.network, dao.id);
                    } catch (error) {
                        logger.error({ postId: referenda.post_id, daoId: dao.id, error: formatError(error), network: referenda.network }, 
                            "Error creating referendum");
                    }
                }
            }
        }
        
        logger.info({ totalReferendas: referendas.length, daoCount: daosToRefresh.length }, 
            "RefreshReferendas completed successfully");

        // After refreshing recent referendums, check ALL referendums in database for NotVoted transition
        await checkAllReferendumsForNotVoted();
        
    } catch (error) {
        logger.error({ error: formatError(error) }, "Error while refreshing Referendas");
    } finally {
        isRefreshing = false;
    }
}