import express from "express";
import bodyParser from "body-parser";
const dotenv = require("dotenv");
dotenv.config();
if (!process.env.REFRESH_INTERVAL)
  throw "Please specify REFRESH_INTERVAL in .env!";
import { refreshReferendas } from "./refresh";
import { READY_CHECK_INTERVAL, SUCCESS_PAGE } from "./utils/constants";

import { checkForVotes } from "./mimir/checkForVotes";
import { createSubsystemLogger } from "./config/logger";
import { Subsystem } from "./types/logging";
import { db } from "./database/connection";

// Route configuration
import { configureRoutes } from "./routes";

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

// Configure all routes
configureRoutes(app);

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

    logger.info("Starting initial operations...");
    checkForVotes(); // check for votes immediately
    refreshReferendas(30);

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
