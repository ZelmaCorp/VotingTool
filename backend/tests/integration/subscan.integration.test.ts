import { checkSubscan } from '../../src/mimir/checkForVotes';
import { ReferendumId } from '../../src/types/properties';

describe('Subscan Integration Tests', () => {
  // Test data for Polkadot
  const POLKADOT_EXTRINSIC_HASH = '0xe606ce20fbeda00fe62cca4c8b98b77c820ae0f09a77948dddb2eb891302f58f';
  const POLKADOT_REFERENDUM_ID: ReferendumId = 1586;

  // Test data for Kusama
  const KUSAMA_EXTRINSIC_HASH = '0xf0281230cd1fe7ac36aea13e0334968125a22063efda804ca409104e7f6699f3';
  const KUSAMA_REFERENDUM_ID: ReferendumId = 529;

  beforeAll(() => {
    // Ensure we have the required environment variables
    expect(process.env.SUBSCAN_API_KEY).toBeDefined();
    expect(process.env.POLKADOT_MULTISIG).toBeDefined();
    expect(process.env.KUSAMA_MULTISIG).toBeDefined();
  });

  describe('API Integration', () => {
    it('should successfully fetch extrinsics from Polkadot', async () => {
      const votedList = [POLKADOT_REFERENDUM_ID];
      const result = await checkSubscan(votedList);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty(POLKADOT_REFERENDUM_ID.toString());
      expect(result[POLKADOT_REFERENDUM_ID]).toBe(POLKADOT_EXTRINSIC_HASH);
    });

    it('should successfully fetch extrinsics from Kusama', async () => {
      const votedList = [KUSAMA_REFERENDUM_ID];
      const result = await checkSubscan(votedList);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty(KUSAMA_REFERENDUM_ID.toString());
      expect(result[KUSAMA_REFERENDUM_ID]).toBe(KUSAMA_EXTRINSIC_HASH);
    });
  });

  describe('Data Processing', () => {
    it('should correctly process nested extrinsics', async () => {
      // Test with both Polkadot and Kusama IDs to ensure nested extrinsics are processed
      const votedList = [POLKADOT_REFERENDUM_ID, KUSAMA_REFERENDUM_ID];
      const result = await checkSubscan(votedList);
      
      // Verify both extrinsics are processed
      expect(result).toBeDefined();
      expect(result).toHaveProperty(POLKADOT_REFERENDUM_ID.toString());
      expect(result).toHaveProperty(KUSAMA_REFERENDUM_ID.toString());
      
      // Verify the extrinsic hashes are correct
      expect(result[POLKADOT_REFERENDUM_ID]).toBe(POLKADOT_EXTRINSIC_HASH);
      expect(result[KUSAMA_REFERENDUM_ID]).toBe(KUSAMA_EXTRINSIC_HASH);
    });

    it('should correctly extract referendum IDs', async () => {
      // Test with a mix of IDs to ensure proper extraction
      const votedList = [POLKADOT_REFERENDUM_ID, KUSAMA_REFERENDUM_ID];
      const result = await checkSubscan(votedList);
      
      // Verify the structure of the result
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // Verify each referendum ID is properly extracted and mapped
      votedList.forEach(id => {
        expect(result).toHaveProperty(id.toString());
        expect(typeof result[id]).toBe('string');
        expect(result[id].length).toBeGreaterThan(0);
      });
    });

    it('should create valid extrinsic hash maps', async () => {
      const votedList = [POLKADOT_REFERENDUM_ID, KUSAMA_REFERENDUM_ID];
      const result = await checkSubscan(votedList);
      
      // Verify the result is a valid map
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // Verify each entry in the map
      Object.entries(result).forEach(([id, hash]) => {
        // Verify ID is a number
        expect(Number(id)).not.toBeNaN();
        
        // Verify hash is a valid hex string
        expect(hash).toMatch(/^0x[a-fA-F0-9]+$/);
        
        // Verify hash length (typically 66 characters for 0x + 32 bytes)
        expect(hash.length).toBe(66);
      });
    });
  });
}); 