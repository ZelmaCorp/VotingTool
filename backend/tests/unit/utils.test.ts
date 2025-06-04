import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';

// Mocking global fetch
global.fetch = jest.fn();

describe('CoinGecko Unit Tests - Price Fetching', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('fetchDotToUsdRate', () => {
    it('should return the DOT/USD rate successfully', async () => {
      const mockRate = 123.45;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { usd: mockRate } }),
      } as Response);

      const rate = await fetchDotToUsdRate();
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      expect(rate).toBe(mockRate);
    });

    it('should throw an error if the fetch call fails', async () => {
      const errorMessage = 'Network failure';
      (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchDotToUsdRate()).rejects.toThrow(errorMessage);
    });

    it('should throw an error if the API response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchDotToUsdRate()).rejects.toThrow('Error fetching DOT/USD rate: Not Found');
    });

    it('should return 0 if the expected data structure is missing in the response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ someothercoin: { usd: 100 } }),
      } as Response);

      const rate = await fetchDotToUsdRate();

      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should return 0 if the usd field is missing in the response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ polkadot: { eur: 100 } }),
      } as Response);

      const rate = await fetchDotToUsdRate();

      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('fetchKusToUsdRate', () => {
    it('should return the KSM/USD rate successfully', async () => {
      const mockRate = 67.89;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { usd: mockRate } }),
      } as Response);

      const rate = await fetchKusToUsdRate();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
      expect(rate).toBe(mockRate);
    });

    it('should throw an error if the fetch call fails', async () => {
      const errorMessage = 'Network failure';
      (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchKusToUsdRate()).rejects.toThrow(errorMessage);
    });

    it('should throw an error if the API response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchKusToUsdRate()).rejects.toThrow('Error fetching KSM/USD rate: Not Found');
    });

    it('should return 0 if the expected data structure is missing in the response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ someothercoin: { usd: 100 } }),
      } as Response);

      const rate = await fetchKusToUsdRate();

      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should return 0 if the usd field is missing in the response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ kusama: { eur: 100 } }),
      } as Response);

      const rate = await fetchKusToUsdRate();

      expect(rate).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
}); 