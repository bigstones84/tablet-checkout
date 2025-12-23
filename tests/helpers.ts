import { ScraperFunction, PriceResult } from '../src/types';

export function createMockScraper(result: Omit<PriceResult, 'url' | 'productKey'>): ScraperFunction {
  return async (productKey: string): Promise<PriceResult> => {
    return {
      ...result,
      url: `https://example.com/${productKey}`,
      productKey
    };
  };
}
