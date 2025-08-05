import express, { Request, Response } from "express";
import bodyParser from "body-parser";
const dotenv = require("dotenv");
dotenv.config();
if (!process.env.REFRESH_INTERVAL)
  throw "Please specify REFRESH_INTERVAL in .env!";
import { refreshReferendas } from "./refresh";
import { sendReadyProposalsToMimir } from "./mimir/refreshEndpoint";
import { READY_CHECK_INTERVAL, SUCCESS_PAGE } from "./utils/constants";
import { waitUntilStartMinute } from "./utils/utils";
import { checkForVotes } from "./mimir/checkForVotes";
import { createSubsystemLogger } from "./config/logger";
import { Subsystem } from "./types/logging";

const logger = createSubsystemLogger(Subsystem.APP);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/send-to-mimir", async (req: Request, res: Response) => {
  try {
    await sendReadyProposalsToMimir();
    res.send(SUCCESS_PAGE);
  } catch (error) {
    res
      .status(500)
      .send("Error sending referendas to Mimir: " + (error as any).message);
  }
});

app.get('/refresh-referendas', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30; // Default to 30, allow user override
    
    // Start refresh in background (don't await)
    refreshReferendas(limit).catch(error => {
      logger.error({ error: error.message, limit }, 'Background refresh failed');
    });
    
    // Return immediately
    res.json({ 
      message: `Referenda refresh started in background with limit ${limit}`,
      timestamp: new Date().toISOString(),
      limit: limit,
      status: "started"
    });
  } catch (error) {
    res.status(500).json({ error: "Error starting refresh: " + (error as any).message });
  }
});

// Deep sync configuration  
const DEEP_SYNC_LIMIT = parseInt(process.env.DEEP_SYNC_LIMIT || "100");
const DEEP_SYNC_HOUR = parseInt(process.env.DEEP_SYNC_HOUR || "3"); // 3 AM UTC by default

/** Check if current time matches deep sync schedule */
function shouldRunDeepSync(): boolean {
  const now = new Date();
  const currentHour = now.getUTCHours();
  return currentHour === DEEP_SYNC_HOUR;
}

/** Smart refresh that runs deep sync once daily */
async function smartRefreshReferendas(): Promise<void> {
  const isDeepSync = shouldRunDeepSync();
  const limit = isDeepSync ? DEEP_SYNC_LIMIT : undefined; // undefined uses default (30)
  
  await refreshReferendas(limit);
}

async function main() {
  try {
    logger.info({ 
      deepSyncLimit: DEEP_SYNC_LIMIT,
      deepSyncHour: DEEP_SYNC_HOUR,
      refreshInterval: process.env.REFRESH_INTERVAL
    }, "Starting OpenGov Voting Tool");

    logger.info("Waiting until the start minute...");
    checkForVotes(); // check for votes immediately

    await waitUntilStartMinute();

    logger.info("Running initial referenda refresh...");
    await smartRefreshReferendas(); // Initial refresh with smart logic

    logger.info("Starting periodic referenda refresh...");
    setInterval(smartRefreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

    setInterval(() => checkForVotes(), Number(READY_CHECK_INTERVAL) * 1000);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`OpenGov Voting tool is running, port: ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, "Fatal error in main()");
    process.exit(1);
  }
}

main();
