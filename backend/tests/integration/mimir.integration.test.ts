import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { Chain, ReferendumId, SuggestedVote } from "../../src/types/properties";
import { ReadyProposal } from "../../src/types/mimir";
import { proposeVoteTransaction } from "../../src/mimir/proposeVote";
import { KeyringPair } from "@polkadot/keyring/types";

describe('Mimir Integration Tests', () => {
  let api: ApiPromise;
  let keyring: Keyring;
  let proposer: KeyringPair;
  let originalMnemonic: string | undefined;
  let originalKusamaMultisig: string | undefined;
  let originalPolkadotMultisig: string | undefined;
  
  beforeAll(async () => {
    // Store original environment variables
    originalMnemonic = process.env.PROPOSER_MNEMONIC;
    originalKusamaMultisig = process.env.KUSAMA_MULTISIG;
    originalPolkadotMultisig = process.env.POLKADOT_MULTISIG;

    // Verify sandbox environment is configured
    if (!process.env.SANDBOX_PROPOSER_MNEMONIC) {
      throw new Error('SANDBOX_PROPOSER_MNEMONIC not configured');
    }
    if (!process.env.SANDBOX_KUSAMA_MULTISIG) {
      throw new Error('SANDBOX_KUSAMA_MULTISIG not configured');
    }
    if (!process.env.SANDBOX_POLKADOT_MULTISIG) {
      throw new Error('SANDBOX_POLKADOT_MULTISIG not configured');
    }

    // Set sandbox environment variables
    process.env.PROPOSER_MNEMONIC = process.env.SANDBOX_PROPOSER_MNEMONIC;
    process.env.KUSAMA_MULTISIG = process.env.SANDBOX_KUSAMA_MULTISIG;
    process.env.POLKADOT_MULTISIG = process.env.SANDBOX_POLKADOT_MULTISIG;

    await cryptoWaitReady();
    
    // Initialize keyring with sandbox mnemonic
    keyring = new Keyring({ type: "sr25519" });
    proposer = keyring.addFromMnemonic(process.env.SANDBOX_PROPOSER_MNEMONIC);
  });

  afterAll(async () => {
    // Restore original environment variables
    process.env.PROPOSER_MNEMONIC = originalMnemonic;
    process.env.KUSAMA_MULTISIG = originalKusamaMultisig;
    process.env.POLKADOT_MULTISIG = originalPolkadotMultisig;
  });

  describe('Kusama Transaction Submission', () => {
    it('should successfully submit a vote transaction to sandbox Mimir', async () => {
      const testReferendumId = 123; // Use a real test referendum ID
      const testMultisig = process.env.SANDBOX_KUSAMA_MULTISIG;
      
      const result = await proposeVoteTransaction(
        testMultisig!,
        Chain.Kusama,
        testReferendumId,
        SuggestedVote.Aye
      );

      expect(result).toBeDefined();
      expect(result.ready.id).toBe(testReferendumId);
      expect(result.ready.voted).toBe(SuggestedVote.Aye);
    });

    it('should handle batch transactions in sandbox', async () => {
      // Test submitting multiple votes in sequence
      const testMultisig = process.env.SANDBOX_KUSAMA_MULTISIG;
      const votes = [
        { id: 123, vote: SuggestedVote.Aye },
        { id: 124, vote: SuggestedVote.Nay },
        { id: 125, vote: SuggestedVote.Abstain }
      ];

      const results = await Promise.all(
        votes.map(v => 
          proposeVoteTransaction(
            testMultisig!,
            Chain.Kusama,
            v.id,
            v.vote
          )
        )
      );

      expect(results).toHaveLength(votes.length);
      results.forEach((result, index) => {
        expect(result.ready.id).toBe(votes[index].id);
        expect(result.ready.voted).toBe(votes[index].vote);
      });
    });

    it('should successfully submit 20 related transactions to sandbox Mimir', async () => {
      const testMultisig = process.env.SANDBOX_KUSAMA_MULTISIG;
      
      // Create 20 transactions with related IDs (1001-1020)
      const votes = Array.from({ length: 20 }, (_, i) => {
        const id = 1001 + i; // IDs from 1001 to 1020
        // Alternate between Aye, Nay, and Abstain
        const voteType = i % 3 === 0 ? SuggestedVote.Aye : 
                        i % 3 === 1 ? SuggestedVote.Nay : 
                        SuggestedVote.Abstain;
        return { id, vote: voteType };
      });

      console.log('Submitting 20 transactions with IDs:', votes.map(v => v.id).join(', '));

      const results = await Promise.all(
        votes.map(v => 
          proposeVoteTransaction(
            testMultisig!,
            Chain.Kusama,
            v.id,
            v.vote
          )
        )
      );

      // Verify all transactions were processed
      expect(results).toHaveLength(20);
      
      // Verify each result matches its input
      results.forEach((result, index) => {
        const expectedVote = votes[index];
        expect(result.ready.id).toBe(expectedVote.id);
        expect(result.ready.voted).toBe(expectedVote.vote);
        console.log(`Transaction ${result.ready.id} (${result.ready.voted}) processed successfully`);
      });
    }, 120000); // Increased timeout to 2 minutes for 20 transactions
  });

  describe('Kusama Error Handling', () => {
    it('should handle invalid referendum IDs', async () => {
      const testMultisig = process.env.SANDBOX_KUSAMA_MULTISIG;
      
      await expect(
        proposeVoteTransaction(
          testMultisig!,
          Chain.Kusama,
          -1, // Invalid referendum ID
          SuggestedVote.Aye
        )
      ).rejects.toThrow();
    });
  });

  describe('Kusama End-to-End Flow', () => {
    it('should complete full voting cycle in sandbox', async () => {
      // Test complete flow from proposal to execution
      // This will be implemented once we have the sandbox environment
      const testMultisig = process.env.SANDBOX_KUSAMA_MULTISIG;
      const testReferendumId = 536;
      
      // 1. Submit vote
      const voteResult = await proposeVoteTransaction(
        testMultisig!,
        Chain.Kusama,
        testReferendumId,
        SuggestedVote.Aye
      );
      
      expect(voteResult).toBeDefined();
      expect(voteResult.ready.id).toBe(testReferendumId);
      
      // 2. Verify vote was recorded
      // This part will be implemented once we have the sandbox environment
      // and know how to verify votes in the sandbox
    });
  });

  describe('Polkadot Transaction Submission', () => {
    it('should successfully submit a vote transaction to sandbox Mimir', async () => {
      const testReferendumId = 123; // Use a real test referendum ID
      const testMultisig = process.env.SANDBOX_POLKADOT_MULTISIG;
      
      const result = await proposeVoteTransaction(
        testMultisig!,
        Chain.Polkadot,
        testReferendumId,
        SuggestedVote.Aye
      );

      expect(result).toBeDefined();
      expect(result.ready.id).toBe(testReferendumId);
      expect(result.ready.voted).toBe(SuggestedVote.Aye);
    });

    it('should handle batch transactions in sandbox', async () => {
      // Test submitting multiple votes in sequence
      const testMultisig = process.env.SANDBOX_POLKADOT_MULTISIG;
      const votes = [
        { id: 123, vote: SuggestedVote.Aye },
        { id: 124, vote: SuggestedVote.Nay },
        { id: 125, vote: SuggestedVote.Abstain }
      ];

      const results = await Promise.all(
        votes.map(v => 
          proposeVoteTransaction(
            testMultisig!,
            Chain.Polkadot,
            v.id,
            v.vote
          )
        )
      );

      expect(results).toHaveLength(votes.length);
      results.forEach((result, index) => {
        expect(result.ready.id).toBe(votes[index].id);
        expect(result.ready.voted).toBe(votes[index].vote);
      });
    });

    it('should successfully submit 20 related transactions to sandbox Mimir', async () => {
      const testMultisig = process.env.SANDBOX_POLKADOT_MULTISIG;
      
      // Create 20 transactions with related IDs (1001-1020)
      const votes = Array.from({ length: 20 }, (_, i) => {
        const id = 1001 + i; // IDs from 1001 to 1020
        // Alternate between Aye, Nay, and Abstain
        const voteType = i % 3 === 0 ? SuggestedVote.Aye : 
                        i % 3 === 1 ? SuggestedVote.Nay : 
                        SuggestedVote.Abstain;
        return { id, vote: voteType };
      });

      console.log('Submitting 20 transactions with IDs:', votes.map(v => v.id).join(', '));

      const results = await Promise.all(
        votes.map(v => 
          proposeVoteTransaction(
            testMultisig!,
            Chain.Polkadot,
            v.id,
            v.vote
          )
        )
      );

      // Verify all transactions were processed
      expect(results).toHaveLength(20);
      
      // Verify each result matches its input
      results.forEach((result, index) => {
        const expectedVote = votes[index];
        expect(result.ready.id).toBe(expectedVote.id);
        expect(result.ready.voted).toBe(expectedVote.vote);
        console.log(`Transaction ${result.ready.id} (${result.ready.voted}) processed successfully`);
      });
    }, 120000); // Increased timeout to 2 minutes for 20 transactions
  });

  describe('Polkadot Error Handling', () => {
    it('should handle invalid referendum IDs', async () => {
      const testMultisig = process.env.SANDBOX_POLKADOT_MULTISIG;
      
      await expect(
        proposeVoteTransaction(
          testMultisig!,
          Chain.Polkadot,
          -1, // Invalid referendum ID
          SuggestedVote.Aye
        )
      ).rejects.toThrow();
    });
  });

  describe('Polkadot End-to-End Flow', () => {
    it('should complete full voting cycle in sandbox', async () => {
      // Test complete flow from proposal to execution
      const testMultisig = process.env.SANDBOX_POLKADOT_MULTISIG;
      const testReferendumId = 1586; // Use a real test referendum ID
      
      // 1. Submit vote
      const voteResult = await proposeVoteTransaction(
        testMultisig!,
        Chain.Polkadot,
        testReferendumId,
        SuggestedVote.Aye
      );
      
      expect(voteResult).toBeDefined();
      expect(voteResult.ready.id).toBe(testReferendumId);
      
      // 2. Verify vote was recorded
      // This part will be implemented once we have the sandbox environment
      // and know how to verify votes in the sandbox
    });
  });
}); 