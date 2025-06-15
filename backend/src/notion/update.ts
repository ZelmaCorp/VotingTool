import axios from "axios";
import { fetchReferendumContent } from "../polkAssembly/fetchReferendas";
import { NotionPageId, NotionProperties, NotionUpdatePageRequest, UpdateReferendumInput } from "../types/notion";
import { PolkassemblyReferenda } from "../types/polkassemly";
import { Chain } from "../types/properties";
import { calculateReward, getValidatedStatus, sleep } from "../utils/utils";
import { updateContent } from "./updateContent";
import { RateLimitHandler } from "../utils/rate-limit-handler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";

const notionApiToken = process.env.NOTION_API_TOKEN;


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

    // Fill the properties, that are coming from Polkassembly
    const properties: UpdateReferendumInput = {
        title: referenda.title,
        number: referenda.post_id,
        requestedAmount: rewardString,
        referendumTimeline: getValidatedStatus(referenda.status)
    }

    // Prepare the data for Notion
    const data = prepareNotionData(properties);

    try {
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

        await sleep(100);
        
        // Update content with rate limiting handled in updateContent function
        await updateContent(pageId, contentResp.content);

        return pageId;
        
    } catch (error) {
        console.error('Error updating page:', (error as any).response ? (error as any).response.data : (error as any).message);
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