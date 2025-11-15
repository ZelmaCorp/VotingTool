import { promises as fs } from "fs";
import path from "path";
import { ReadyProposal } from "../types/mimir";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.MIMIR);

/* Saves readyProposals to a file, as JSON */
export async function saveReadyProposalsToFile(
  readyProposals: ReadyProposal[],
  filePath: string
): Promise<void> {
  try {
    const dir = path.dirname(filePath);

    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(readyProposals, null, 2));
  } catch (error) {
    logger.error({ error: formatError(error), filePath }, "Error saving ready proposals to file");
    throw error;
  }
}

/* Loads readyProposals from a file, file has to be JSON */
export async function loadReadyProposalsFromFile(
  filePath: string
): Promise<ReadyProposal[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true }); // ensure directory exists
      await fs.writeFile(filePath, "[]", "utf8");
      return [];
    } else {
      logger.error({ error: formatError(error), filePath }, "Error loading ready proposals from file");
      throw error;
    }
  }
}
