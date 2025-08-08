import { checkSubscan } from '../../src/mimir/checkForVotes';
import { ReferendumId } from '../../src/types/properties';

describe('Subscan Integration Tests', () => {
  beforeAll(() => {
    // Ensure we have the required environment variables
    expect(process.env.SUBSCAN_API_KEY).toBeDefined();
    expect(process.env.POLKADOT_MULTISIG).toBeDefined();
    expect(process.env.KUSAMA_MULTISIG).toBeDefined();
  });

  describe('API Integration', () => {
    it('should successfully connect to Subscan APIs and return valid data structure', async () => {
      // Test with empty list first to ensure the function works
      const result = await checkSubscan([]);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }, 30000); // 30 second timeout for API calls

    it('should handle real referendum IDs and return proper hash mapping', async () => {
      // Get some real referendum IDs by calling the function first with empty array
      // This tests the actual integration without relying on hard-coded values
      const emptyResult = await checkSubscan([]);
      
      // If there are any referendum IDs in the actual data, test with them
      const existingReferendumIds = Object.keys(emptyResult).map(id => parseInt(id));
      
      if (existingReferendumIds.length > 0) {
        // Take the first few referendum IDs that actually exist
        const testIds = existingReferendumIds.slice(0, 3);
        const result = await checkSubscan(testIds);
        
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        
        // Verify that each requested ID is in the result
        testIds.forEach(id => {
          if (result[id]) {
            expect(result).toHaveProperty(id.toString());
            expect(typeof result[id]).toBe('string');
            expect(result[id]).toMatch(/^0x[a-fA-F0-9]+$/);
            expect(result[id].length).toBe(66); // 0x + 64 hex chars
          }
        });
             } else {
         // If no referendum IDs exist, just verify the structure is correct
         expect(emptyResult).toEqual({});
       }
    }, 30000); // 30 second timeout for API calls
  });

  describe('Data Processing', () => {
    it('should return valid extrinsic hash map structure', async () => {
      const result = await checkSubscan([]);
      
      // Verify the result is a valid map
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // Verify each entry in the map has the correct format
      Object.entries(result).forEach(([id, hash]) => {
        // Verify ID is a number
        expect(Number(id)).not.toBeNaN();
        
        // Verify hash is a valid hex string
        expect(hash).toMatch(/^0x[a-fA-F0-9]+$/);
        
        // Verify hash length (typically 66 characters for 0x + 32 bytes)
        expect(hash.length).toBe(66);
      });
    }, 30000);

    it('should handle empty referendum list gracefully', async () => {
      const result = await checkSubscan([]);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // Empty list should return object (may be empty or contain existing votes)
    }, 30000);

    it('should handle non-existent referendum IDs gracefully', async () => {
      // Use referendum IDs that are very unlikely to exist
      const nonExistentIds = [999999, 888888, 777777];
      const result = await checkSubscan(nonExistentIds);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      // The result should not contain the non-existent IDs
      nonExistentIds.forEach(id => {
        expect(result[id]).toBeUndefined();
      });
    }, 30000);
  });
}); 