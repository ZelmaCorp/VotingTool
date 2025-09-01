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
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: "sr25519" });
    const sender = keyring.addFromMnemonic(MNEMONIC);
    const senderAddress = encodeAddress(sender.address, ss58Format);

    console.log("Multisig address: ", multisig);
    console.log("Proposer address: ", senderAddress);

    const payload = prepareRequestPayload(vote, id, conviction, api);

    const request = prepareRequest(payload, multisig, sender, senderAddress);
    console.log("Request: ", request)

    const chain = network.toLowerCase();

    const response = await fetch(
      `${MIMIR_URL}/v1/chains/${chain}/${multisig}/transactions/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    wsProvider.disconnect();

    let result;

    const text = await response.text();

    try {
      result = JSON.parse(text);
    } catch (error) {
      //throw new Error(`Response was not JSON. Text content: ${text}`);
      console.error(`Response was not JSON. Text content: ${text}`);
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }

    console.log("Transaction result: ", result);
    console.log("HTTP response.ok: ", response.ok)
    console.log("response.status: ", response.status)

    return {
      ready: {
        id,
        voted: vote,
        timestamp: payload.timestamp,
      },
      payload
    };
  } catch (error) {
    console.error("Failed to upload transaction: ", error);
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
