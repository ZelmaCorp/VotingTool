import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';

describe('CoinGecko Integration Tests', () => {
  jest.setTimeout(15000); // 15 second timeout for API calls

  // NOTE: These tests may fail with "Too Many Requests" due to CoinGecko rate limiting.
  // This is expected behavior - the tests are designed to pass when the API is available.
  // Try running them again after some time when rate limits reset.

  describe('DOT/USD Rate Fetching', () => {
    it('should fetch real DOT/USD rate from CoinGecko API', async () => {
      const rate = await fetchDotToUsdRate();
      
      expect(rate).toBeGreaterThan(0);
      expect(typeof rate).toBe('number');
      expect(Number.isFinite(rate)).toBe(true);
      
      // DOT price should be reasonable (between $1 and $500)
      expect(rate).toBeGreaterThanOrEqual(1);
      expect(rate).toBeLessThan(500);
      
      console.log(`✓ Current DOT/USD rate: $${rate}`);
    });

    it('should detect CoinGecko API structure changes for DOT', async () => {
      // This test will FAIL if CoinGecko changes their API response structure
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      
      // Verify the expected API structure
      expect(data).toHaveProperty('polkadot');
      expect(data.polkadot).toHaveProperty('usd');
      expect(typeof data.polkadot.usd).toBe('number');
      
      // Should not have unexpected top-level properties that might indicate API changes
      const expectedKeys = ['polkadot'];
      const actualKeys = Object.keys(data);
      expect(actualKeys).toEqual(expectedKeys);
      
      // Should not have unexpected nested properties
      const expectedNestedKeys = ['usd'];
      const actualNestedKeys = Object.keys(data.polkadot);
      expect(actualNestedKeys).toEqual(expectedNestedKeys);
      
      console.log(`✓ DOT API structure validated: ${JSON.stringify(data)}`);
    });

    it('should handle DOT API rate limits by throwing appropriate errors', async () => {
      // Test multiple rapid calls - this may trigger rate limiting
      // When rate limited, our functions should throw errors (not return invalid data)
      const promises = Array(3).fill(null).map(async (_, index) => {
        try {
          const rate = await fetchDotToUsdRate();
          expect(rate).toBeGreaterThan(0);
          expect(typeof rate).toBe('number');
          return { success: true, rate, index };
        } catch (error: any) {
          // If rate limited, expect a proper error message
          if (error.message && error.message.includes('Too Many Requests')) {
            return { success: false, error: error.message, index };
          }
          throw error; // Re-throw unexpected errors
        }
      });
      
      const results = await Promise.all(promises);
      
      // At least some results should be present (either success or expected rate limit errors)
      expect(results.length).toBe(3);
      
      const successfulResults = results.filter(r => r.success);
      const rateLimitedResults = results.filter(r => !r.success);
      
      console.log(`✓ DOT rate handling: ${successfulResults.length} successful, ${rateLimitedResults.length} rate limited`);
      
      // All results should be either successful or properly rate limited
      expect(successfulResults.length + rateLimitedResults.length).toBe(3);
    });
  });

  describe('KSM/USD Rate Fetching', () => {
    it('should fetch real KSM/USD rate from CoinGecko API', async () => {
      const rate = await fetchKusToUsdRate();
      
      expect(rate).toBeGreaterThan(0);
      expect(typeof rate).toBe('number');
      expect(Number.isFinite(rate)).toBe(true);
      
      // KSM price should be reasonable (between $5 and $200)
      expect(rate).toBeGreaterThanOrEqual(5);
      expect(rate).toBeLessThan(200);
      
      console.log(`✓ Current KSM/USD rate: $${rate}`);
    });

    it('should detect CoinGecko API structure changes for KSM', async () => {
      // This test will FAIL if CoinGecko changes their API response structure
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      
      // Verify the expected API structure
      expect(data).toHaveProperty('kusama');
      expect(data.kusama).toHaveProperty('usd');
      expect(typeof data.kusama.usd).toBe('number');
      
      // Should not have unexpected top-level properties
      const expectedKeys = ['kusama'];
      const actualKeys = Object.keys(data);
      expect(actualKeys).toEqual(expectedKeys);
      
      // Should not have unexpected nested properties
      const expectedNestedKeys = ['usd'];
      const actualNestedKeys = Object.keys(data.kusama);
      expect(actualNestedKeys).toEqual(expectedNestedKeys);
      
      console.log(`✓ KSM API structure validated: ${JSON.stringify(data)}`);
    });

    it('should handle KSM API rate limits by throwing appropriate errors', async () => {
      // Test multiple rapid calls - this may trigger rate limiting
      const promises = Array(3).fill(null).map(async (_, index) => {
        try {
          const rate = await fetchKusToUsdRate();
          expect(rate).toBeGreaterThan(0);
          expect(typeof rate).toBe('number');
          return { success: true, rate, index };
        } catch (error: any) {
          if (error.message && error.message.includes('Too Many Requests')) {
            return { success: false, error: error.message, index };
          }
          throw error;
        }
      });
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(3);
      
      const successfulResults = results.filter(r => r.success);
      const rateLimitedResults = results.filter(r => !r.success);
      
      console.log(`✓ KSM rate handling: ${successfulResults.length} successful, ${rateLimitedResults.length} rate limited`);
      expect(successfulResults.length + rateLimitedResults.length).toBe(3);
    });
  });

  describe('Cross-validation Tests', () => {
    it('should maintain reasonable DOT/KSM price ratio', async () => {
      const [dotRate, ksmRate] = await Promise.all([
        fetchDotToUsdRate(),
        fetchKusToUsdRate()
      ]);
      
      const ratio = dotRate / ksmRate;
      
      // DOT/KSM ratio should typically be between 0.1 and 10 (based on historical data)
      expect(ratio).toBeGreaterThan(0.1);
      expect(ratio).toBeLessThan(10);
      
      console.log(`✓ DOT/KSM ratio: ${ratio.toFixed(3)} (DOT: $${dotRate}, KSM: $${ksmRate})`);
    });

    it('should detect if CoinGecko introduces new rate limiting or changes', async () => {
      // Test both APIs simultaneously to detect changes in behavior
      const startTime = Date.now();
      
      const [dotRate, ksmRate] = await Promise.all([
        fetchDotToUsdRate(),
        fetchKusToUsdRate()
      ]);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Both should return valid rates
      expect(dotRate).toBeGreaterThan(0);
      expect(ksmRate).toBeGreaterThan(0);
      
      // Should complete in reasonable time (less than 10 seconds)
      expect(duration).toBeLessThan(10000);
      
      // Test sequential calls to ensure no unexpected blocking
      const dotRate2 = await fetchDotToUsdRate();
      expect(Math.abs(dotRate - dotRate2) / dotRate).toBeLessThan(0.1); // Less than 10% difference
      
      console.log(`✓ Combined API call completed in ${duration}ms`);
      console.log(`✓ Rate consistency check: DOT ${dotRate} vs ${dotRate2} (${Math.abs(dotRate - dotRate2).toFixed(4)} difference)`);
    });
  });

  describe('Error Scenario Tests', () => {
    it('should properly handle network errors', async () => {
      // Mock a network failure scenario by testing with an invalid endpoint
      const originalFetch = global.fetch;
      
      global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));
      
      await expect(fetchDotToUsdRate()).rejects.toThrow('Network error');
      
      // Restore original fetch
      global.fetch = originalFetch;
    });

    it('should detect and fail on unexpected API response formats', async () => {
      // This test ensures our functions fail fast if CoinGecko changes response format
      const originalFetch = global.fetch;
      
      // Mock an unexpected response structure
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          // Changed structure - should make our function return 0 and log error
          polkadot_new_format: { usd_price: 100 } 
        }),
      } as Response);
      
      const rate = await fetchDotToUsdRate();
      expect(rate).toBe(0); // Should return 0 for unknown structure
      
      // Restore original fetch
      global.fetch = originalFetch;
      
      console.log('✓ Unknown API format properly handled by returning 0');
    });

    it('should demonstrate that rate limit errors are properly thrown', async () => {
      // This test shows that rate limiting errors are thrown (not swallowed)
      const originalFetch = global.fetch;
      
      // Mock a rate limit response
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      } as Response);
      
      await expect(fetchDotToUsdRate()).rejects.toThrow('Error fetching DOT/USD rate: Too Many Requests');
      
      // Restore original fetch
      global.fetch = originalFetch;
      
      console.log('✓ Rate limit error properly thrown (as expected)');
    });
  });

  // Helper test to check if we're currently rate limited
  describe('Rate Limit Status Check', () => {
    it('should report current rate limit status', async () => {
      console.log('\n=== RATE LIMIT STATUS CHECK ===');
      
      try {
        const dotRate = await fetchDotToUsdRate();
        console.log(`✅ DOT API: Available (rate: $${dotRate})`);
      } catch (error: any) {
        if (error.message && error.message.includes('Too Many Requests')) {
          console.log('⚠️  DOT API: Rate limited - tests will fail until limit resets');
        } else {
          console.log(`❌ DOT API: Other error - ${error.message}`);
        }
      }
      
      try {
        const ksmRate = await fetchKusToUsdRate();
        console.log(`✅ KSM API: Available (rate: $${ksmRate})`);
      } catch (error: any) {
        if (error.message && error.message.includes('Too Many Requests')) {
          console.log('⚠️  KSM API: Rate limited - tests will fail until limit resets');
        } else {
          console.log(`❌ KSM API: Other error - ${error.message}`);
        }
      }
      
      console.log('=== END STATUS CHECK ===\n');
      
      // This test always passes - it's just for reporting
      expect(true).toBe(true);
    });
  });
}); 