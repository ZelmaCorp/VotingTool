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


/** Update a Referenda in the Notion database */
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

    // DEBUG: Log the detail API response to see if it has updated title
    logger.info({
        pageId,
        postId: referenda.post_id,
        listApiTitle: referenda.title,
        detailApiResponse: Object.keys(contentResp),
        detailApiTitle: contentResp.title || 'NO_TITLE_FIELD'
    }, 'Comparing title sources');

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
                title: `#${properties.number}-${properties.title}`,
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

function prepareNotionData(input: UpdateReferendumInput): NotionUpdatePageRequest {
    const properties: NotionProperties = {};

    if (input.title && input.number) {
        properties['Title'] = {
            type: 'rich_text',
            rich_text: [{ text: { content: `#${input.number}-${input.title}` } }]
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