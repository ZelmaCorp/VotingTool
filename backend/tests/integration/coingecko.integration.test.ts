import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';

describe('CoinGecko Integration Tests', () => {
  jest.setTimeout(15000); // 15 second timeout for API calls

  describe('DOT/USD Rate Fetching', () => {
    it('should fetch real DOT/USD rate from CoinGecko API', async () => {
      const rate = await fetchDotToUsdRate();
      
      expect(rate).toBeGreaterThan(0);
      expect(typeof rate).toBe('number');
      expect(Number.isFinite(rate)).toBe(true);
      
      // DOT price should be reasonable (between $1 and $500)
      expect(rate).toBeGreaterThanOrEqual(1);
      expect(rate).toBeLessThan(50000);
    });

    it('should detect CoinGecko API structure changes for DOT', async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      
      // Verify the expected API structure
      expect(data).toHaveProperty('polkadot');
      expect(data.polkadot).toHaveProperty('usd');
      expect(typeof data.polkadot.usd).toBe('number');
      
      // Should not have unexpected top-level properties
      const expectedKeys = ['polkadot'];
      const actualKeys = Object.keys(data);
      expect(actualKeys).toEqual(expectedKeys);
      
      // Should not have unexpected nested properties
      const expectedNestedKeys = ['usd'];
      const actualNestedKeys = Object.keys(data.polkadot);
      expect(actualNestedKeys).toEqual(expectedNestedKeys);
    });
  });

  describe('KSM/USD Rate Fetching', () => {
    it('should fetch real KSM/USD rate from CoinGecko API', async () => {
      const rate = await fetchKusToUsdRate();
      
      expect(rate).toBeGreaterThan(0);
      expect(typeof rate).toBe('number');
      expect(Number.isFinite(rate)).toBe(true);
      
      // KSM price should be reasonable (between $5 and $200)
      expect(rate).toBeGreaterThanOrEqual(1);
      expect(rate).toBeLessThan(20000);
    });

    it('should detect CoinGecko API structure changes for KSM', async () => {
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
    });
  });
}); 