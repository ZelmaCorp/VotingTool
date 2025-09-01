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
import { db } from "./database/connection";
import { Referendum } from "./database/models/referendum";
import { VotingDecision } from "./database/models/votingDecision";
import { Chain } from "./types/properties";

// Read version from package.json with fallback
let APP_VERSION = "1.2.0-fallback";
try {
  const packageJson = require("../package.json");
  APP_VERSION = packageJson.version;
} catch (error) {
  // Fallback version if package.json can't be read
  console.warn("Could not read package.json, using fallback version");
}

const logger = createSubsystemLogger(Subsystem.APP);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint for Docker
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all referendums from the database
app.get("/referendums", async (req: Request, res: Response) => {
  try {
    const referendums = await Referendum.getAll();
    res.json(referendums);
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error fetching referendums from database");
    res.status(500).json({ error: "Error fetching referendums: " + (error as any).message });
  }
});

// Update a specific referendum by post_id and chain
app.put("/referendums/:postId/:chain", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const chain = req.params.chain as Chain;
    const updates = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Validate chain
    if (!Object.values(Chain).includes(chain)) {
      return res.status(400).json({ error: "Invalid chain. Must be 'Polkadot' or 'Kusama'" });
    }

    // First, get the referendum to get its database ID
    const referendum = await Referendum.findByPostIdAndChain(postId, chain);
    if (!referendum) {
      return res.status(404).json({ error: "Referendum not found" });
    }

    // Separate referendum fields from voting decision fields
    const referendumFields: any = {};
    const votingFields: any = {};

    // Fields that go to the referendums table
    const referendumColumns = [
      'title', 'description', 'requested_amount_usd', 'origin', 'referendum_timeline',
      'internal_status', 'link', 'voting_start_date', 'voting_end_date',
      'last_edited_by', 'public_comment', 'public_comment_made', 'ai_summary',
      'reason_for_vote', 'reason_for_no_way', 'voted_link'
    ];

    // Fields that go to the voting_decisions table
    const votingColumns = ['suggested_vote', 'final_vote', 'vote_executed', 'vote_executed_date'];

    // Separate the fields
    Object.keys(updates).forEach(key => {
      if (referendumColumns.includes(key)) {
        referendumFields[key] = updates[key];
      } else if (votingColumns.includes(key)) {
        votingFields[key] = updates[key];
      }
    });

    // Update referendum fields if any
    if (Object.keys(referendumFields).length > 0) {
      await Referendum.update(postId, chain, referendumFields);
    }

    // Update voting decision fields if any
    if (Object.keys(votingFields).length > 0) {
      await VotingDecision.upsert(referendum.id!, votingFields);
    }

    // Return the updated referendum with all related data
    const updatedReferendum = await Referendum.findByPostIdAndChain(postId, chain);
    res.json(updatedReferendum);
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error updating referendum");
    res.status(500).json({ error: "Error updating referendum: " + (error as any).message });
  }
});

app.get("/send-to-mimir", async (req: Request, res: Response) => {
  try {
    await sendReadyProposalsToMimir();
    res.json({ message: "Successfully sent referendas to Mimir", timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error({ error: (error as any).message }, "Error sending referendas to Mimir");
    res.status(500).json({ error: "Error sending referendas to Mimir: " + (error as any).message });
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
      version: APP_VERSION,
      deepSyncLimit: DEEP_SYNC_LIMIT,
      deepSyncHour: DEEP_SYNC_HOUR,
      refreshInterval: process.env.REFRESH_INTERVAL
    }, `Starting OpenGov Voting Tool v${APP_VERSION}`);

    // Initialize the database first
    logger.info("Initializing database...");
    await db.initialize();
    logger.info("Database initialized successfully");

    logger.info("Waiting until the start minute...");
    checkForVotes(); // check for votes immediately
    refreshReferendas(30);

    await waitUntilStartMinute();

    logger.info("Starting periodic referenda refresh...");
    setInterval(smartRefreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

    setInterval(() => checkForVotes(), Number(READY_CHECK_INTERVAL) * 1000);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info({ version: APP_VERSION, port: PORT }, `OpenGov Voting tool v${APP_VERSION} is running on port ${PORT}`);
    });

    // Set up graceful shutdown handlers
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await gracefulShutdown();
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await gracefulShutdown();
    });

  } catch (error) {
    logger.error({ error }, "Fatal error in main()");
    await gracefulShutdown();
    process.exit(1);
  }
}

/**
 * Gracefully shutdown the application
 */
async function gracefulShutdown(): Promise<void> {
  try {
    logger.info('Closing database connection...');
    await db.close();
    logger.info('Database connection closed');
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during graceful shutdown');
    process.exit(1);
  }
}

main();
