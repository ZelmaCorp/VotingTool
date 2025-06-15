import { ApiPromise, WsProvider } from "@polkadot/api";
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

// Use real multisig addresses from environment variables
const POLKADOT_MULTISIG = process.env.POLKADOT_MULTISIG as string;
const KUSAMA_MULTISIG = process.env.KUSAMA_MULTISIG as string;
const NON_EXISTENT_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

// Type for the voting result
type VotingResult = {
  Casting?: {
    delegations: any;
    prior: any;
    votes: any[];
  };
};

describe('On-chain Voting Integration Tests', () => {
  let polkadotApi: ApiPromise;
  let kusamaApi: ApiPromise;

  beforeAll(async () => {
    // Initialize Polkadot API
    const polkadotProvider = new WsProvider('wss://rpc.polkadot.io');
    polkadotApi = await ApiPromise.create({ provider: polkadotProvider });

    // Initialize Kusama API
    const kusamaProvider = new WsProvider('wss://kusama-rpc.polkadot.io');
    kusamaApi = await ApiPromise.create({ provider: kusamaProvider });
  }, 30000);

  afterAll(async () => {
    await polkadotApi.disconnect();
    await kusamaApi.disconnect();
  });

  it('should connect to Polkadot network', async () => {
    const [chain, nodeName, nodeVersion] = await Promise.all([
      polkadotApi.rpc.system.chain(),
      polkadotApi.rpc.system.name(),
      polkadotApi.rpc.system.version()
    ]);

    expect(chain.toString()).toBe('Polkadot');
    expect(nodeName.toString()).toBe('Parity Polkadot');
    expect(nodeVersion.toString()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should connect to Kusama network', async () => {
    const [chain, nodeName, nodeVersion] = await Promise.all([
      kusamaApi.rpc.system.chain(),
      kusamaApi.rpc.system.name(),
      kusamaApi.rpc.system.version()
    ]);

    expect(chain.toString()).toBe('Kusama');
    expect(nodeVersion.toString()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should fetch voting data from Polkadot', async () => {
    const votingResult = await polkadotApi.query.convictionVoting.votingFor(POLKADOT_MULTISIG, 0);
    const result = votingResult.toHuman() as unknown as VotingResult;
    
    console.log('Polkadot voting result:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('should fetch voting data from Kusama', async () => {
    const votingResult = await kusamaApi.query.convictionVoting.votingFor(KUSAMA_MULTISIG, 0);
    const result = votingResult.toHuman() as unknown as VotingResult;
    
    console.log('Kusama voting result:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('should handle non-existent account', async () => {
    const votingResult = await polkadotApi.query.convictionVoting.votingFor(NON_EXISTENT_ADDRESS, 0);
    const result = votingResult.toHuman() as unknown as VotingResult;
    
    console.log('Non-existent account result:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('should verify the structure of the voting result', async () => {
    const votingResult = await polkadotApi.query.convictionVoting.votingFor(POLKADOT_MULTISIG, 0);
    const result = votingResult.toHuman() as unknown as VotingResult;
    
    console.log('Voting result structure:', JSON.stringify(result, null, 2));
    
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('Casting');
    expect(result.Casting).toHaveProperty('delegations');
    expect(result.Casting).toHaveProperty('prior');
    expect(result.Casting).toHaveProperty('votes');
  });
}); 