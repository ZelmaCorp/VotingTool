import { Chain } from "./types/properties";
import { createReferenda } from "./notion/create";
import { fetchDataFromAPI } from "./polkAssembly/fetchReferendas";
import { findNotionPageByPostId, getNotionPages } from "./notion/findNotionPage";
import { fetchDotToUsdRate, fetchKusToUsdRate } from "./utils/utils";
import { updateReferenda } from "./notion/update";
import { createSubsystemLogger } from "./config/logger";
import { Subsystem } from "./types/logging";

const logger = createSubsystemLogger(Subsystem.REFRESH);

const notionDatabaseId = process.env.NOTION_DATABASE_ID;

export async function refreshReferendas(limit: number = 30) {
    try {
        if (!notionDatabaseId) throw "Please specify REFRESH_INTERVAL in .env!";
        logger.info("Refreshing Referendas...")

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

        // Go through the fetched referendas
        for (const referenda of referendas) {
            // If Referenda exist in Notion, update it, otherwise, create new page
            const found = await findNotionPageByPostId(pages, referenda.post_id);
            const exchangeRate = referenda.network === Chain.Polkadot ? dotUsdRate : kusUsdRate;

            if (found) {
                logger.info({ postId: referenda.post_id }, `Proposal found in Notion`);
                try {
                    await updateReferenda(found.id, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: (error as any).message }, "Error updating referenda");
                }
            } else {
                logger.info({ postId: referenda.post_id }, `Proposal not in Notion, creating new page`);
                try {
                    await createReferenda(notionDatabaseId, referenda, exchangeRate, referenda.network);
                } catch (error) {
                    logger.error({ postId: referenda.post_id, error: (error as any).message }, "Error creating referenda");
                }
            }
        }
    } catch (error) {
        logger.error({ error: (error as any).message }, "Error while refreshing Referendas");
    }
}