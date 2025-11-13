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
 * Sends transaction to Mimir, where it can be batched with other transactions, then signed.
 * The transaction should be created by a [Proposer](https://docs.mimir.global/advanced/proposer).
 * @param multisig - Array of addresses that are part of the multisig.
 * @param network - Network to send the transaction to. Can be Kusama or Polkadot.
 * @param id - Referendum ID.
 * @param vote - Aye | Nay | Abstain (contains emojis, see types).
 * @param conviction - Conviction value for the vote. Default is 1.
 */
export async function proposeVoteTransaction(
  multisig: string,
  network: Chain,
  id: ReferendumId,
  vote: SuggestedVote,
  conviction: number = 1
): Promise<{ ready: ReadyProposal; payload: VotingPayload }> {
  try {
    if (!MNEMONIC) throw "Please specify MNEMONIC in .env!";
    if (!multisig)
      throw "Please specify POLKADOT_MULTISIG and/or KUSAMA_MULTISIG in .env!";

    await cryptoWaitReady();

    let ss58Format = POLKADOT_SS58_FORMAT;
    if (network === Chain.Kusama) ss58Format = KUSAMA_SS58_FORMAT;

    const wsProvider = new WsProvider(
      network === Chain.Kusama ? KUSAMA_PROVIDER : POLKADOT_PROVIDER
    );
    
    // Suppress Polkadot API console warnings that break JSON logging
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    console.log = () => {};
    console.warn = () => {};
    
    const api = await ApiPromise.create({ provider: wsProvider });
    
    // Restore console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    const keyring = new Keyring({ type: "sr25519" });
    const sender = keyring.addFromMnemonic(MNEMONIC);
    const senderAddress = encodeAddress(sender.address, ss58Format);

    logger.debug({ multisig, senderAddress, network, referendumId: id }, "Preparing vote transaction");

    const payload = prepareRequestPayload(vote, id, conviction, api);

    const request = prepareRequest(payload, multisig, sender, senderAddress);
    logger.info({ 
      referendumId: id,
      network,
      multisig,
      calldata: request.calldata, 
      timestamp: request.timestamp,
      allowDuplicates: request.allowDuplicates,
      signer: request.signer
    }, "Request prepared for Mimir")

    // Map network to Mimir chain identifier
    // Since referendum voting migrated to Asset Hub, use assethub-* identifiers
    const chain = network === Chain.Kusama ? 'assethub-kusama' : 'assethub-polkadot';
    
    logger.info({ 
      network, 
      chain, 
      note: "Using Asset Hub chain identifier for Mimir" 
    }, "Chain identifier mapping");

    const mimirUrl = `${MIMIR_URL}/v1/chains/${chain}/${multisig}/transactions/batch`;
    
    // Log the full request we're about to send
    logger.info({ 
      mimirUrl, 
      chain, 
      multisig, 
      referendumId: id,
      requestBody: request,
      signatureLength: request.signature.length,
      calldataLength: request.calldata.length,
      hasAllRequiredFields: !!(request.calldata && request.timestamp && request.signature && request.signer && request.allowDuplicates !== undefined)
    }, "Sending transaction to Mimir");

    const response = await fetch(mimirUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    wsProvider.disconnect();

    let result;
    const text = await response.text();

    try {
      result = JSON.parse(text);
    } catch (error) {
      logger.warn({ responseText: text, referendumId: id }, "Mimir response was not JSON");
    }

    if (!response.ok) {
      // Log the full error details
      logger.error({ 
        status: response.status, 
        statusText: response.statusText,
        responseBody: text,
        referendumId: id,
        chain,
        multisig,
        mimirUrl,
        requestCalldata: request.calldata,
        requestTimestamp: request.timestamp,
        requestSigner: request.signer,
        requestAllowDuplicates: request.allowDuplicates
      }, `Mimir API returned ${response.status} error`);
      
      // Log the error again in a super visible way
      logger.error(`MIMIR ERROR DETAILS`);
      logger.error(`Status: ${response.status} ${response.statusText}`);
      logger.error(`Referendum ID: ${id}`);
      logger.error(`Chain: ${chain}`);
      logger.error(`Multisig: ${multisig}`);
      logger.error(`URL: ${mimirUrl}`);
      logger.error(`Response Body: ${text}`);
      logger.error(`Request Calldata: ${request.calldata}`);
      logger.error(`Request Signer: ${request.signer}`);
      
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}. Response: ${text}`
      );
    }

    logger.info({ 
      referendumId: id, 
      status: response.status,
      hasResult: !!result 
    }, "Transaction successfully sent to Mimir")

    return {
      ready: {
        id,
        voted: vote,
        timestamp: payload.timestamp,
      },
      payload
    };
  } catch (error) {
    logger.error({ error: formatError(error), referendumId: id, network, vote }, "Failed to upload transaction to Mimir");
    throw error;
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
