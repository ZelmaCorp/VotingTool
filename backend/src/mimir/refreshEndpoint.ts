import { getNotionPages } from "../notion/findNotionPage";
import { READY_FILE } from "../utils/constants";
import { loadReadyProposalsFromFile, saveReadyProposalsToFile } from "../utils/readyFileHandlers";
import { handleReferendaVote } from "./handleReferenda";

/**
 * Sends ready proposals to Mimir for batch voting.
 * Reads all Notion pages, identifies proposals marked as "Ready to vote",
 * and creates voting transactions in Mimir for batch execution.
 */
export async function sendReadyProposalsToMimir(): Promise<void> {
  try {
    console.info("Sending ReadyToVote proposals to Mimir ...");
    const readyProposals = await loadReadyProposalsFromFile(READY_FILE as string);
    const pages = await getNotionPages();
    const mimirPromises = [];

    for (const page of pages) {
      const network = page.properties?.["Chain"].select?.name;
      const postId = page.properties?.["Number"].title[0].text.content.trim();

      const promise = handleReferendaVote(page, network, postId);
      mimirPromises.push(promise);
    }

    const results = await Promise.allSettled(mimirPromises);

    // Log failed operations or write READY_FILE
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Promise ${index} failed (rejected):`, result.reason);
      } else {
        const ready = result.value;
        if (ready) {
          readyProposals.push(ready);
        } else {
          console.warn(`Promise ${index} resolved but returned undefined.`);
        }
      }
    });

    await saveReadyProposalsToFile(readyProposals, READY_FILE as string);
  } catch (error) {
    console.error(
      "Error while sending ReadyToVote proposals to Mimir: ",
      (error as any).message
    );
    throw error;
  }
}
