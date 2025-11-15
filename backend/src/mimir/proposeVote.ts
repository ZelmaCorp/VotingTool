import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { stringToHex } from "@polkadot/util";
import {
  BALANCE,
  KUSAMA_PROVIDER,
  KUSAMA_SS58_FORMAT,
  MIMIR_URL,
  MNEMONIC,
  POLKADOT_PROVIDER,
  POLKADOT_SS58_FORMAT,
} from "../utils/constants";
import { Chain, ReferendumId, SuggestedVote } from "../types/properties";
import { KeyringPair } from "@polkadot/keyring/types";
import { ReadyProposal, VotingPayload } from "../types/mimir";
import { createSubsystemLogger, formatError } from "../config/logger";
import { Subsystem } from "../types/logging";

const logger = createSubsystemLogger(Subsystem.MIMIR);

/**
 * Validates required configuration
 */
function validateConfig(multisig: string): void {
  if (!MNEMONIC) throw new Error("Please specify MNEMONIC in .env!");
  if (!multisig) throw new Error("Please specify POLKADOT_MULTISIG and/or KUSAMA_MULTISIG in .env!");
}

/**
 * Suppresses console output during callback execution
 */
async function suppressConsole<T>(callback: () => Promise<T>): Promise<T> {
  const originalLog = console.log;
  const originalWarn = console.warn;
  console.log = () => {};
  console.warn = () => {};
  
  try {
    return await callback();
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
  }
}

/**
 * Gets network-specific configuration
 */
function getNetworkConfig(network: Chain) {
  const isKusama = network === Chain.Kusama;
  return {
    provider: isKusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER,
    ss58Format: isKusama ? KUSAMA_SS58_FORMAT : POLKADOT_SS58_FORMAT,
    chain: isKusama ? 'assethub-kusama' : 'assethub-polkadot',
  };
}

/**
 * Initializes Polkadot API connection
 */
async function initializeApi(network: Chain): Promise<{ api: ApiPromise; provider: WsProvider }> {
  await cryptoWaitReady();
  const { provider: providerUrl } = getNetworkConfig(network);
  const wsProvider = new WsProvider(providerUrl);
  const api = await suppressConsole(() => ApiPromise.create({ provider: wsProvider }));
  return { api, provider: wsProvider };
}

/**
 * Creates signer from mnemonic
 */
function createSigner(network: Chain): { sender: KeyringPair; address: string } {
  const { ss58Format } = getNetworkConfig(network);
  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromMnemonic(MNEMONIC);
  const address = encodeAddress(sender.address, ss58Format);
  return { sender, address };
}

/**
 * Sends request to Mimir API
 */
async function sendToMimir(
  request: any,
  multisig: string,
  chain: string,
  id: ReferendumId,
  vote: SuggestedVote
): Promise<void> {
  const mimirUrl = `${MIMIR_URL}/v1/chains/${chain}/${multisig}/transactions/batch`;
  logger.info({ referendumId: id, chain, vote }, "Sending transaction to Mimir");

  const response = await fetch(mimirUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const text = await response.text();

  if (!response.ok) {
    logger.error({ 
      status: response.status,
      statusText: response.statusText,
      responseBody: text,
      referendumId: id,
      chain,
      multisig,
      mimirUrl
    }, `Mimir API returned ${response.status} error`);
    
    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}. Response: ${text}`);
  }

  logger.info({ referendumId: id, vote, chain }, "Transaction successfully sent to Mimir");
}

/**
 * Sends transaction to Mimir for batch voting.
 * The transaction should be created by a Proposer (https://docs.mimir.global/advanced/proposer).
 */
export async function proposeVoteTransaction(
  multisig: string,
  network: Chain,
  id: ReferendumId,
  vote: SuggestedVote,
  conviction: number = 1
): Promise<{ ready: ReadyProposal; payload: VotingPayload }> {
  validateConfig(multisig);

  let provider: WsProvider | undefined;

  try {
    const { api, provider: wsProvider } = await initializeApi(network);
    provider = wsProvider;

    const { sender, address } = createSigner(network);
    const payload = prepareRequestPayload(vote, id, conviction, api);
    const request = prepareRequest(payload, multisig, sender, address);
    const { chain } = getNetworkConfig(network);

    await sendToMimir(request, multisig, chain, id, vote);

    return {
      ready: { id, voted: vote, timestamp: payload.timestamp },
      payload
    };
  } catch (error) {
    logger.error({ error: formatError(error), referendumId: id, network, vote }, "Failed to upload transaction to Mimir");
    throw error;
  } finally {
    provider?.disconnect();
  }
}

/**
 * Prepares request payload that will be sent to Mimir
 * @param vote - Aye | Nay | Astain.
 * @param id - The referendum ID.
 * @param conviction - The conviction multiplier, default is 1.
 * @param api - The Polkadot API instance.
 * @returns The request payload that was created by @polkadot/api. This will be executed on-chain.
 */
function prepareRequestPayload(
  vote: SuggestedVote,
  id: ReferendumId,
  conviction: number,
  api: ApiPromise
): VotingPayload {
  let call;
  if (vote === SuggestedVote.Abstain) {
    call = api.tx.convictionVoting.vote(id, {
      Split: {
        aye: 0,
        nay: 0,
        abstain: BALANCE,
      },
    }).method;
  } else {
    call = api.tx.convictionVoting.vote(id, {
      Standard: {
        vote: {
          aye: vote === SuggestedVote.Aye,
          conviction: conviction,
        },
        balance: BALANCE,
      },
    }).method;
  }

  const callHex = call.toHex();

  const payload = {
    calldata: callHex,
    timestamp: Date.now(),
  };

  return payload;
}

/**
 * Prepares request that will be sent to Mimir
 * @param payload - The calldata and timestamp.
 * @param multisig - The multisig address.
 * @param sender - Propoer's KeyringPair.
 * @param senderAddress - Proposer's address.
 * @returns The request object.
 */
function prepareRequest(
  payload: VotingPayload,
  multisig: string,
  sender: KeyringPair,
  senderAddress: string
) {
  const message = [
    "Sign for mimir batch\n",
    `Call Data: ${payload.calldata}\n`,
    `Address: ${multisig}\n`,
    `Timestamp: ${payload.timestamp}`,
  ].join("");

  const signature = sender.sign(stringToHex(message));
  const signatureHex = `0x${Buffer.from(signature).toString("hex")}`;

  const request = {
    ...payload,
    allowDuplicates: true,
    signature: signatureHex,
    signer: senderAddress,
  };

  return request;
}
