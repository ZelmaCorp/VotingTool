import axios from 'axios';
import { CreateReferendumInput, NotionCreatePageRequest, NotionDatabaseId, NotionProperties } from '../types/notion';
import { Chain, InternalStatus } from '../types/properties';
import { calculateReward, getValidatedOrigin, getValidatedStatus } from '../utils/utils';
import { PolkassemblyReferenda } from '../types/polkassemly';
import { updateContent } from './updateContent';
import { fetchReferendumContent } from '../polkAssembly/fetchReferendas';
import { RateLimitHandler } from '../utils/rateLimitHandler';
import { RATE_LIMIT_CONFIGS } from '../config/rate-limit-config';
import { createSubsystemLogger } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.NOTION);

const notionApiToken = process.env.NOTION_API_TOKEN;

/** Create a Referenda in the Notion database */
export async function createReferenda(
  databaseId: NotionDatabaseId, 
  referenda: PolkassemblyReferenda,
  exchangeRate: number,
  network: Chain
): Promise<NotionDatabaseId> {
  const notionApiUrl = 'https://api.notion.com/v1/pages';

  // Fetch content (description) and reward information
  const contentResp = await fetchReferendumContent(referenda.post_id, referenda.network);
  const rewardString = calculateReward(contentResp, exchangeRate, network);

  // Fill the properties, that are coming from Polkassembly
  const properties: CreateReferendumInput = {
    title: referenda.title,
    requestedAmount: rewardString,
    chain: network,
    origin: getValidatedOrigin(referenda.origin),
    referendumTimeline: getValidatedStatus(referenda.status),
    internalStatus: InternalStatus.NotStarted,
    link: `https://${referenda.network.toLowerCase()}.polkassembly.io/referenda/${referenda.post_id}`,
    number: referenda.post_id,
    created_at: referenda.created_at
  }

  // Prepare the data for Notion
  const data = prepareNotionData(databaseId, properties);

  // Send request to Notion with rate limiting
  try {
    const rateLimitHandler = RateLimitHandler.getInstance();
    
    const response = await rateLimitHandler.executeWithRateLimit(
      async () => {
        return await axios.post(notionApiUrl, data, {
          headers: {
            'Authorization': `Bearer ${notionApiToken}`,
            'Content-Type': 'application/json',
            'Notion-Version': process.env.NOTION_VERSION,
          },
        });
      },
      RATE_LIMIT_CONFIGS.critical,
      `create-referenda-${referenda.post_id}`
    );
    
    // Add content to the newly created page
    await updateContent(response.data.id, contentResp.content);

    logger.info({ 
      pageId: response.data.id, 
      postId: referenda.post_id, 
      network 
    }, 'Page created successfully');
    return response.data.id;

  } catch (error) {
    logger.error({ 
      postId: referenda.post_id, 
      network,
      error: (error as any).response ? (error as any).response.data : (error as any).message 
    }, 'Error creating page');
    throw error;
  }
}

function prepareNotionData(
    databaseId: string, 
    input: CreateReferendumInput
  ): NotionCreatePageRequest {
    const properties: NotionProperties = {};
  
    if (input.title) {
      properties['Title'] = {
        type: 'rich_text',
        rich_text: [{ text: { content: input.title } }] // Just the title, no #number- prefix
      };
    }

    if (input.number) {
        properties['Number'] = {
          type: 'title',
          title: [{ text: { content: input.number.toString().trim() } }]
        };
      }
  
    if (input.requestedAmount !== undefined) {
      properties['Requested $'] = {
        type: 'number',
        number: input.requestedAmount === null ? undefined : input.requestedAmount
      };
    }
  
    if (input.chain) {
      properties['Chain'] = {
        type: 'select',
        select: { name: input.chain }
      };
    }
  
    if (input.origin) {
      properties['Origin'] = {
        type: 'select',
        select: { name: input.origin }
      };
    }
  
    if (input.referendumTimeline) {
      properties['Referendum timeline'] = {
        type: 'status',
        status: { name: input.referendumTimeline }
      };
    }
  
    if (input.internalStatus) {
      properties['Internal status'] = {
        type: 'status',
        status: { name: input.internalStatus }
      };
    }

    if (input.created_at) {
      const creationDate = new Date(input.created_at);
      const isPolkadot = input.chain?.toLowerCase() === 'polkadot'; 
      const votingDurationDays = isPolkadot ? 28 : 14; // duration is manually calculated which is misleading in some cases
      const endDate = new Date(creationDate);
      endDate.setDate(creationDate.getDate() + votingDurationDays);
  
      properties['Voting'] = {
        type: 'date',
        date: {
          start: creationDate.toISOString(),
          end: endDate.toISOString(),
          time_zone: null
        }
      };
    }

    if (input.link) {
      properties['Link'] = {
        type: 'url',
        url: input.link
      };
    }
  
    return {
      object: 'page',
      parent: {
        database_id: databaseId,
        type: 'database_id'
      },
      properties
    };
}
