import { Chain } from '../types/properties';

class PriceCache {
    private static instance: PriceCache;
    private dotPrice: number = 0;
    private ksmPrice: number = 0;

    private constructor() {}

    public static getInstance(): PriceCache {
        if (!PriceCache.instance) {
            PriceCache.instance = new PriceCache();
        }
        return PriceCache.instance;
    }

    public getPrice(network: Chain): number {
        return network === Chain.Polkadot ? this.dotPrice : this.ksmPrice;
    }

    public setPrice(network: Chain, price: number): void {
        if (network === Chain.Polkadot) {
            this.dotPrice = price;
        } else {
            this.ksmPrice = price;
        }
    }

    public hasPrice(network: Chain): boolean {
        return this.getPrice(network) > 0;
    }
}

export const priceCache = PriceCache.getInstance(); 