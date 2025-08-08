import { Chain } from "./types/properties";
import { createReferenda } from "./notion/create";
import { fetchDataFromAPI } from "./polkAssembly/fetchReferendas";
import { findNotionPageByPostId, getNotionPages } from "./notion/findNotionPage";
import { fetchDotToUsdRate, fetchKusToUsdRate } from "./utils/utils";
import { updateReferenda } from "./notion/update";
import { createSubsystemLogger } from "./config/logger";
import { Subsystem } from "./types/logging";

// Read version from package.json with fallback
let APP_VERSION = "1.2.0-fallback";
try {
  const packageJson = require("../package.json");
  APP_VERSION = packageJson.version;
} catch (error) {
  // Fallback version if package.json can't be read
  console.warn("Could not read package.json, using fallback version");
}

const logger = createSubsystemLogger(Subsystem.REFRESH);

const notionDatabaseId = process.env.NOTION_DATABASE_ID;

// Add concurrency protection flag
let isRefreshing = false;

export async function refreshReferendas(limit: number = 30) {
    // Prevent concurrent refresh operations
    if (isRefreshing) {
        logger.debug('Previous refreshReferendas operation still running, skipping...');
        return;
    }

    try {
        isRefreshing = true;
        if (!notionDatabaseId) throw "Please specify REFRESH_INTERVAL in .env!";
        logger.info({ limit, version: APP_VERSION }, `Refreshing Referendas v${APP_VERSION}...`)

        // Fetch latest proposals from both networks, get list of Notion pages and fetch exchange rates
        const [polkadotPosts, kusamaPosts, pages, dotUsdRate, kusUsdRate] = await Promise.all([
            fetchDataFromAPI(limit, Chain.Polkadot),
            fetchDataFromAPI(limit, Chain.Kusama),
            getNotionPages(),
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
            // If Referenda exist in Notion, update it, otherwise, create new page
            const found = await findNotionPageByPostId(pages, referenda.post_id, referenda.network);
            const exchangeRate = referenda.network === Chain.Polkadot ? dotUsdRate : kusUsdRate;

            if (found) {
                logger.info({ postId: referenda.post_id, network: referenda.network }, `Proposal found in Notion, updating`);
                try {
                    await updateReferenda(found.id, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: (error as any).message }, "Error updating referenda");
                }
            } else {
                logger.info({ postId: referenda.post_id, network: referenda.network }, `Proposal not in Notion, creating new page`);
                try {
                    await createReferenda(notionDatabaseId, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: (error as any).message }, "Error creating referenda");
                }
            }
        }
    } catch (error) {
        logger.error({ error: (error as any).message }, "Error while refreshing Referendas");
    } finally {
        isRefreshing = false;
    }
}