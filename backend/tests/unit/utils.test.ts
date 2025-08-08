// Mock the logger before any imports
jest.mock('../../src/config/logger', () => ({
  createSubsystemLogger: jest.fn(),
  logError: jest.fn()
}));

// Create mock logger
const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

// Set up the mock before importing modules that use it
import { createSubsystemLogger } from '../../src/config/logger';
(createSubsystemLogger as jest.Mock).mockReturnValue(mockLogger);

// Now import the modules under test
import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';
import { priceCache } from '../../src/utils/priceCache';
import { Chain } from '../../src/types/properties';

// Mocking global fetch
global.fetch = jest.fn();

describe('CoinGecko Unit Tests - Price Fetching', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    mockLogger.error.mockReset();
    mockLogger.info.mockReset();
    mockLogger.warn.mockReset();
    mockLogger.debug.mockReset();
    // Reset price cache
    (priceCache as any).dotPrice = 0;
    (priceCache as any).ksmPrice = 0;
  });

  describe('fetchDotToUsdRate', () => {
    it('should fetch and cache DOT/USD rate successfully', async () => {
      const mockRate = 123.45;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { usd: mockRate } }),
      } as Response);

      const rate = await fetchDotToUsdRate();
      
      expect(rate).toBe(mockRate);
      expect(priceCache.getPrice(Chain.Polkadot)).toBe(mockRate);
    });

    it('should return cached price when API call fails', async () => {
      // First call succeeds and caches the price
      const cachedRate = 123.45;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { usd: cachedRate } }),
      } as Response);
      
      await fetchDotToUsdRate();
      
      // Second call fails but returns cached price
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));
      
      const rate = await fetchDotToUsdRate();
      expect(rate).toBe(cachedRate);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should return cached price for invalid API response', async () => {
      // First call succeeds and caches the price
      const cachedRate = 123.45;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { usd: cachedRate } }),
      } as Response);
      
      await fetchDotToUsdRate();
      
      // Second call returns invalid data
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      } as Response);
      
      const rate = await fetchDotToUsdRate();
      expect(rate).toBe(cachedRate);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('fetchKusToUsdRate', () => {
    it('should fetch and cache KSM/USD rate successfully', async () => {
      const mockRate = 67.89;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { usd: mockRate } }),
      } as Response);

      const rate = await fetchKusToUsdRate();
      
      expect(rate).toBe(mockRate);
      expect(priceCache.getPrice(Chain.Kusama)).toBe(mockRate);
    });

    it('should return cached price when API call fails', async () => {
      // First call succeeds and caches the price
      const cachedRate = 67.89;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { usd: cachedRate } }),
      } as Response);
      
      await fetchKusToUsdRate();
      
      // Second call fails but returns cached price
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));
      
      const rate = await fetchKusToUsdRate();
      expect(rate).toBe(cachedRate);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should return cached price for invalid API response', async () => {
      // First call succeeds and caches the price
      const cachedRate = 67.89;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { usd: cachedRate } }),
      } as Response);
      
      await fetchKusToUsdRate();
      
      // Second call returns invalid data
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      } as Response);
      
      const rate = await fetchKusToUsdRate();
      expect(rate).toBe(cachedRate);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
}); 