import { Chain } from '../../src/types/properties';
import { priceCache } from '../../src/utils/priceCache';
import { fetchDotToUsdRate, fetchKusToUsdRate } from '../../src/utils/utils';

// Mock fetch
global.fetch = jest.fn();

describe('PriceCache', () => {
    beforeEach(() => {
        // Reset the singleton instance for each test
        (priceCache as any).dotPrice = 0;
        (priceCache as any).ksmPrice = 0;
        (fetch as jest.Mock).mockReset();
    });

    it('should maintain separate prices for DOT and KSM', () => {
        priceCache.setPrice(Chain.Polkadot, 10.5);
        priceCache.setPrice(Chain.Kusama, 20.7);

        expect(priceCache.getPrice(Chain.Polkadot)).toBe(10.5);
        expect(priceCache.getPrice(Chain.Kusama)).toBe(20.7);
    });

    it('should return 0 for unset prices', () => {
        expect(priceCache.getPrice(Chain.Polkadot)).toBe(0);
        expect(priceCache.getPrice(Chain.Kusama)).toBe(0);
    });

    it('should correctly identify if a price exists', () => {
        expect(priceCache.hasPrice(Chain.Polkadot)).toBe(false);
        expect(priceCache.hasPrice(Chain.Kusama)).toBe(false);

        priceCache.setPrice(Chain.Polkadot, 10.5);
        expect(priceCache.hasPrice(Chain.Polkadot)).toBe(true);
        expect(priceCache.hasPrice(Chain.Kusama)).toBe(false);
    });

    it('should maintain the same instance across calls', () => {
        const instance1 = priceCache;
        const instance2 = priceCache;
        expect(instance1).toBe(instance2);
    });

    it('should maintain state between API calls', async () => {
        // First API call succeeds
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ polkadot: { usd: 10.5 } })
        } as Response);

        // Second API call fails
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        // First call - should succeed and set price
        const firstResult = await fetchDotToUsdRate();
        expect(firstResult).toBe(10.5);
        expect(priceCache.getPrice(Chain.Polkadot)).toBe(10.5);

        // Second call - should fail but return cached price
        const secondResult = await fetchDotToUsdRate();
        expect(secondResult).toBe(10.5); // Still returns the cached price
        expect(priceCache.getPrice(Chain.Polkadot)).toBe(10.5); // Price is still maintained

        // Verify fetch was called twice
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should maintain separate states for DOT and KSM', async () => {
        // Mock successful DOT call
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ polkadot: { usd: 10.5 } })
        } as Response);

        // Mock successful KSM call
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ kusama: { usd: 20.7 } })
        } as Response);

        // Get both prices
        const dotPrice = await fetchDotToUsdRate();
        const ksmPrice = await fetchKusToUsdRate();

        // Verify both prices are stored and maintained
        expect(dotPrice).toBe(10.5);
        expect(ksmPrice).toBe(20.7);
        expect(priceCache.getPrice(Chain.Polkadot)).toBe(10.5);
        expect(priceCache.getPrice(Chain.Kusama)).toBe(20.7);
    });
}); 