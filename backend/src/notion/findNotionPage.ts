import axios from "axios";
import { NotionPage } from "../types/notion";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";

const notionApiToken = process.env.NOTION_API_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


/** Function to query Notion database for a matching "URL" (post_id from URL) */ 
export async function findNotionPageByPostId(pageList: any[], postId: number): Promise<NotionPage | null> {
    try {
      const postIdString = postId.toString();

      if (pageList) {
        for (const page of pageList) {
          const urlProperty = page.properties.Link?.url || "";
          const match = urlProperty.match(/(\d+)$/);
          if (match && match[1] === postIdString) {
            return page;
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
        
        const response = await rateLimitHandler.executeWithRateLimit(
            async () => {
                return await axios.post(
                    `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${notionApiToken}`,
                        "Notion-Version": "2022-06-28",
                      },
                    }
                );
            },
            RATE_LIMIT_CONFIGS.interactive,
            `get-notion-pages-${Date.now()}`
        );

        return response.data.results;

    } catch (error) {
        console.error("Error querying Notion database:", (error as any).message);
        throw new Error("Could not query Notion database")
    }
}