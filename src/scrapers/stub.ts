import { PriceResult } from '../types';

export async function scrapeStub(sku: string): Promise<PriceResult> {
  return {
    site: 'Stub',
    price: 299,
    available: true,
    url: `https://example.com/product/${sku}`
  };
}
