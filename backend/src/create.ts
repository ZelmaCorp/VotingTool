import axios from 'axios';
import { CreateReferendumInput, NotionCreatePageRequest, NotionDatabaseId, NotionProperties } from './types/notion';
import { Chain, InternalStatus } from './types/properties';
import { calculateReward, getValidatedOrigin, getValidatedStatus } from './utils/utils';
import { PolkassemblyReferenda } from './types/polkassemly';
import { updateContent } from './updateContent';
import { fetchReferendumContent } from './polkAssembly/fetchReferendas';

const notionApiToken = process.env.NOTION_API_TOKEN;

/**
 * Creates a new referendum page in the Notion database.
 * 
 * @param databaseId - The ID of the Notion database to create the page in
 * @param referenda - The referendum data from Polkassembly
 * @param exchangeRate - Current exchange rate for reward calculation
 * @param network - The blockchain network (Polkadot or Kusama)
 * @returns The ID of the newly created page
 */
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

  // Send request to Notion
  try {
    const response = await axios.post(notionApiUrl, data, {
      headers: {
        'Authorization': `Bearer ${notionApiToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': process.env.NOTION_VERSION,
      },
    });
    
    // Add content to the newly created page
    await updateContent(response.data.id, contentResp.content);

    console.log('Page created successfully:', response.data);
    return response.data.id;

  } catch (error) {
    console.error('Error creating page:', (error as any).response ? (error as any).response.data : (error as any).message);
    throw error;
  }
}

/**
 * Prepares the data for the Notion create request.
 * 
 * @param databaseId - The ID of the Notion database to create the page in
 * @param input - The input data to prepare
 * @returns The prepared data (ready to be sent to Notion)
 */
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
          title: [{ text: { content: input.number.toString() } }]
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
