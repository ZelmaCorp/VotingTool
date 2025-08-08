import axios from "axios";
import { convertHtmlToNotionBlocks } from "../utils/html";
import { NotionPageId } from "../types/notion";
import { RateLimitHandler } from "../utils/rateLimitHandler";
import { RATE_LIMIT_CONFIGS } from "../config/rate-limit-config";
import { createSubsystemLogger } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.NOTION);

const notionApiToken = process.env.NOTION_API_TOKEN;

export async function updateContent(pageId: NotionPageId, content: string) {
  const notionApiUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
  const rateLimitHandler = RateLimitHandler.getInstance();
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Retrieve existing blocks with rate limiting
      const existingBlocksResponse = await rateLimitHandler.executeWithRateLimit(
        async () => {
          return await axios.get(notionApiUrl, {
            headers: {
              Authorization: `Bearer ${notionApiToken}`,
              "Notion-Version": process.env.NOTION_VERSION,
            },
          });
        },
        RATE_LIMIT_CONFIGS.bulk,
        `get-blocks-${pageId}`
      );

      const existingBlocks: { id: string; type: string }[] =
        existingBlocksResponse.data.results;

      // Delete existing paragraph blocks with rate limiting
      const deletePromises = existingBlocks.map((block, index) =>
        rateLimitHandler.executeWithRateLimit(
          async () => {
            return await axios.delete(`https://api.notion.com/v1/blocks/${block.id}`, {
              headers: {
                Authorization: `Bearer ${notionApiToken}`,
                "Notion-Version": process.env.NOTION_VERSION,
              },
            });
          },
          RATE_LIMIT_CONFIGS.bulk,
          `delete-block-${block.id}-${index}`
        )
      );

      await Promise.all(deletePromises); // Delete all in parallel with rate limiting

      // Convert HTML content to Notion blocks
      const newDescriptionBlocks = convertHtmlToNotionBlocks(content);

      if (newDescriptionBlocks.length === 0) {
        logger.debug({ pageId }, "No content to update");
        return;
      }

      // Add new blocks with rate limiting
      await rateLimitHandler.executeWithRateLimit(
        async () => {
          return await axios.patch(
            notionApiUrl,
            { children: newDescriptionBlocks },
            {
              headers: {
                Authorization: `Bearer ${notionApiToken}`,
                "Content-Type": "application/json",
                "Notion-Version": process.env.NOTION_VERSION,
              },
            }
          );
        },
        RATE_LIMIT_CONFIGS.bulk,
        `patch-content-${pageId}`
      );

      logger.info({ pageId, blocksCount: newDescriptionBlocks.length }, `Description updated successfully`);
      return; // Success - exit retry loop

    } catch (error) {
      const isConflictError = (error as any).response?.status === 409;
      const isLastAttempt = attempt === MAX_RETRIES;

      if (isConflictError && !isLastAttempt) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        logger.warn({ 
          pageId, 
          attempt, 
          maxRetries: MAX_RETRIES,
          retryDelay: delay
        }, `Notion conflict detected, retrying in ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue; // Retry
      }

      // Log error and exit (either not a conflict, or final attempt)
      logger.error({ 
        pageId,
        attempt,
        error: (error as any).response ? (error as any).response.data : (error as any).message
      }, "Error updating content");
      break; // Exit retry loop
    }
  }
}
