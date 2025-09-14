export const POLKADOT_SS58_FORMAT = 0;
export const KUSAMA_SS58_FORMAT = 2;

export const MNEMONIC = process.env.PROPOSER_MNEMONIC as string;

export const PASEO_PROVIDER = "wss://paseo.rpc.amforc.com";
export const POLKADOT_PROVIDER = "wss://rpc.polkadot.io";
export const KUSAMA_PROVIDER = "wss://kusama-rpc.polkadot.io";

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
