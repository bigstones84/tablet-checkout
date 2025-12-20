import { ScraperFunction, PriceResult } from '../src/types';

export function createMockScraper(result: Omit<PriceResult, 'url'>): ScraperFunction {
  return async (sku: string): Promise<PriceResult> => {
    return {
      ...result,
      url: `https://example.com/${sku}`
    };
  };
}
