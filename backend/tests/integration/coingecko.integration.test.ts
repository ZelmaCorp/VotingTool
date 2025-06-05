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
  });
}); 