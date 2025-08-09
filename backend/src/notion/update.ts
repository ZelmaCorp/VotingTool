import axios from "axios";
import { fetchReferendumContent } from "../polkAssembly/fetchReferendas";
import { NotionPageId, NotionProperties, NotionUpdatePageRequest, UpdateReferendumInput } from "../types/notion";
import { PolkassemblyReferenda } from "../types/polkassemly";
import { Chain } from "../types/properties";
import { calculateReward, getValidatedStatus, sleep } from "../utils/utils";
import { updateContent } from "./updateContent";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const notionApiToken = process.env.NOTION_API_TOKEN;
const logger = createSubsystemLogger(Subsystem.NOTION);


/**
 * Updates an existing referendum page in the Notion database with latest data.
 * Fetches fresh content from Polkassembly, calculates current reward value,
 * and updates both properties and page content.
 * 
 * @param pageId - The Notion page ID to update
 * @param referenda - The referendum data from Polkassembly
 * @param exchangeRate - Current exchange rate for reward calculation
 * @param network - The blockchain network (Polkadot or Kusama)
 * @returns The updated page ID
 */
export async function updateReferenda(
    pageId: NotionPageId,
    referenda: PolkassemblyReferenda,
    exchangeRate: number,
    network: Chain
): Promise<NotionPageId> {
    const notionApiUrl = `https://api.notion.com/v1/pages/${pageId}`;

    // Fetch content (description) and reward information
    const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
    const rewardString = calculateReward(contentResp, exchangeRate, network);

    // Fill the properties, that are coming from Polkassembly
    const properties: UpdateReferendumInput = {
        title: contentResp.title || referenda.title, // Use detail API title (updated) over list API title (cached)
        number: referenda.post_id,
        requestedAmount: rewardString,
        referendumTimeline: getValidatedStatus(referenda.status)
    }

    logger.info({
        pageId,
        postId: referenda.post_id,
        newTitle: referenda.title,
        newStatus: getValidatedStatus(referenda.status),
        newRequestedAmount: rewardString,
        network: network
    }, 'Starting referenda update');

    // Prepare the data for Notion
    const data = prepareNotionData(properties);

    try {
        logger.info({
            pageId,
            postId: referenda.post_id,
            propertiesPayload: {
                title: properties.title, // Now just the clean title
                requestedAmount: properties.requestedAmount,
                referendumTimeline: properties.referendumTimeline
            }
        }, 'Updating properties');

        const rateLimitHandler = RateLimitHandler.getInstance();
        
        await rateLimitHandler.executeWithRateLimit(
            async () => {
                return await axios.patch(notionApiUrl, data, {
                    headers: {
                      'Authorization': `Bearer ${notionApiToken}`,
                      'Content-Type': 'application/json',
                      'Notion-Version': process.env.NOTION_VERSION,
                    },
                });
            },
            RATE_LIMIT_CONFIGS.bulk,
            `update-referenda-${pageId}`
        );

        logger.info({
            pageId,
            postId: referenda.post_id
        }, 'Properties update completed successfully');

        await sleep(100);
        
        logger.info({
            pageId,
            postId: referenda.post_id,
            contentLength: contentResp.content?.length || 0
        }, 'Starting content update');
        
        // Update content with rate limiting handled in updateContent function
        await updateContent(pageId, contentResp.content);

        logger.info({
            pageId,
            postId: referenda.post_id
        }, 'Referenda update completed successfully');

        return pageId;
        
    } catch (error) {
        logger.error({
            pageId,
            postId: referenda.post_id,
            newTitle: referenda.title,
            error: (error as any).response?.data || (error as any).message
        }, 'Referenda update failed');
        throw error;
    }
}

/**
 * Prepares the data for the Notion update request.
 * 
 * @param input - The input data to prepare
 * @returns The prepared data (ready to be sent to Notion)
 */
function prepareNotionData(input: UpdateReferendumInput): NotionUpdatePageRequest {
    const properties: NotionProperties = {};

    if (input.title && input.number) {
        properties['Title'] = {
            type: 'rich_text',
            rich_text: [{ text: { content: input.title } }] // Just the title, no #number- prefix
        };
    }

    if (input.requestedAmount !== undefined) {
        properties['Requested $'] = {
            type: 'number',
            number: input.requestedAmount === null ? undefined : input.requestedAmount
        };
    }

    if (input.referendumTimeline) {
        properties['Referendum timeline'] = {
            type: 'status',
            status: { name: input.referendumTimeline }
        };
    }

    return { properties };
}