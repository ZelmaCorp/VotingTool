import axios from "axios";
import { NotionPage } from "../types/notion";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";
import { Chain } from "../types/properties";

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


/** Function to query Notion database for a matching post_id AND network */ 
export async function findNotionPageByPostId(pageList: any[], postId: number, network?: Chain): Promise<NotionPage | null> {
    try {
      const postIdString = postId.toString();

      if (pageList) {
        for (const page of pageList) {
          // Method 1: Check the Number field and Chain field directly (most reliable)
          const numberProperty = page.properties?.Number?.title?.[0]?.text?.content;
          const chainProperty = page.properties?.Chain?.select?.name;
          
          if (numberProperty && numberProperty.trim() === postIdString) {
            // If network is specified, make sure it matches
            if (network && chainProperty && chainProperty !== network) {
              continue; // Skip this page, network doesn't match
            }
            return page;
          }
          
          // Method 2: Extract from URL and validate network (fallback method)
          const urlProperty = page.properties.Link?.url || "";
          
          if (network) {
            // Network-specific URL matching
            const networkMatch = urlProperty.match(new RegExp(`${network.toLowerCase()}\\.polkassembly\\.io\\/referenda\\/(\\d+)`));
            if (networkMatch && networkMatch[1] === postIdString) {
              return page;
            }
          } else {
            // Fallback: Generic URL matching (original behavior)
            const match = urlProperty.match(/(\d+)$/);
            if (match && match[1] === postIdString) {
              return page;
            }
          }
          
          // Method 3: Additional safety check with URL contains (only if no network specified)
          if (!network && (urlProperty.includes(`/${postIdString}`) || urlProperty.includes(`${postIdString}`))) {
            // Double-check this is actually the right post by validating URL structure
            const polkadotMatch = urlProperty.match(/polkadot\.polkassembly\.io\/referenda\/(\d+)/);
            const kusamaMatch = urlProperty.match(/kusama\.polkassembly\.io\/referenda\/(\d+)/);
            
            if ((polkadotMatch && polkadotMatch[1] === postIdString) ||
                (kusamaMatch && kusamaMatch[1] === postIdString)) {
              return page;
            }
          }
        }
      }

      return null;

    } catch (error) {
      console.error("Error querying Notion database:", (error as any).message);
      return null;
    }
}

export async function getNotionPages(): Promise<any> {
    try {
        const rateLimitHandler = RateLimitHandler.getInstance();
        let allPages: any[] = [];
        let nextCursor: string | null = null;
        let pageCount = 0;
        
        do {
            const requestBody: any = {};
            if (nextCursor) {
                requestBody.start_cursor = nextCursor;
            }
            
            const response = await rateLimitHandler.executeWithRateLimit(
                async () => {
                    return await axios.post(
                        `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
                        requestBody,
                        {
                          headers: {
                            Authorization: `Bearer ${notionApiToken}`,
                            "Notion-Version": "2022-06-28",
                          },
                        }
                    );
                },
                RATE_LIMIT_CONFIGS.interactive,
                `get-notion-pages-${Date.now()}-${pageCount}`
            );

            const currentPages = response.data.results || [];
            allPages = allPages.concat(currentPages);
            nextCursor = response.data.next_cursor;
            pageCount++;
            
            console.log(`Fetched ${currentPages.length} pages (batch ${pageCount}), total: ${allPages.length}, hasMore: ${!!nextCursor}`);
            
        } while (nextCursor);

        console.log(`Fetched ALL ${allPages.length} pages from Notion database`);
        return allPages;

    } catch (error) {
        console.error("Error querying Notion database:", (error as any).message);
        throw new Error("Could not query Notion database")
    }
}