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

async function main() {
  try {
    logger.info("Waiting until the start minute...");
    checkForVotes(); // check for votes immediately

    await waitUntilStartMinute();

    logger.info("Refreshing referendas...");
    refreshReferendas(); // with 7 app instances, we can't start all of them at the same time (because of the rate limit)

    logger.info("Starting periodic referenda refresh...");
    setInterval(refreshReferendas, Number(process.env.REFRESH_INTERVAL) * 1000);

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
