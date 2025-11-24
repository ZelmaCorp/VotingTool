import { TimelineStatus, InternalStatus } from '../types/properties';

export const POLKADOT_SS58_FORMAT = 0;
export const KUSAMA_SS58_FORMAT = 2;

// MNEMONIC is now stored per-DAO in the database (encrypted)
// Use DAO.getDecryptedMnemonic(daoId) to retrieve it

export const PASEO_PROVIDER = "wss://sys.turboflakes.io";

// Asset Hub RPC - Referendum voting migrated to Asset Hub
// These RPCs are used with Mimir chain identifiers: assethub-polkadot, assethub-kusama
export const POLKADOT_PROVIDER = "wss://polkadot-asset-hub-rpc.polkadot.io";
export const KUSAMA_PROVIDER = "wss://kusama-asset-hub-rpc.polkadot.io";

export const BALANCE = 1000000000;

// Default ReadyToVote -> Completed check interval is 1 minute
export const READY_CHECK_INTERVAL = process.env.READY_CHECK_INTERVAL || 60;

// Cleanup timeout for stale Mimir transactions (in days)
export const MIMIR_TRANSACTION_CLEANUP_DAYS = Number(process.env.MIMIR_TRANSACTION_CLEANUP_DAYS) || 7;

export const SUBSCAN_ROW_COUNT = 20;

export const MIMIR_URL = "https://mimir-client.mimir.global";

export const TRACKS = [
  0, 1, 2, 10, 11, 12, 13, 14, 15, 20, 21, 30, 31, 32, 33, 34,
];

export const READY_FILE = "./readyToVote.json";

/**
 * TimelineStatus values that indicate the referendum is in a terminal state
 * These are final states where the referendum is complete and won't change
 */
export const TERMINAL_STATUSES: TimelineStatus[] = [
    TimelineStatus.TimedOut,        // Vote period expired without passing
    TimelineStatus.Executed,        // Referendum passed and was executed successfully
    TimelineStatus.ExecutionFailed, // Referendum passed but execution failed
    TimelineStatus.Rejected,        // Referendum was rejected/failed
    TimelineStatus.Cancelled,       // Referendum was cancelled
    TimelineStatus.Canceled,        // Referendum was canceled (alternative spelling)
    TimelineStatus.Killed,          // Referendum was killed
    TimelineStatus.Confirmed,       // Referendum was confirmed (passed)
    TimelineStatus.Enactment        // Referendum passed and is in enactment period (vote is over)
];

/**
 * TimelineStatus values that indicate the vote is over
 * All terminal statuses mean voting is complete
 */
export const VOTE_OVER_STATUSES: TimelineStatus[] = TERMINAL_STATUSES;

/**
 * InternalStatus values that indicate the DAO has voted
 */
export const VOTED_STATUSES: InternalStatus[] = [
    InternalStatus.VotedAye,
    InternalStatus.VotedNay,
    InternalStatus.VotedAbstain
];
