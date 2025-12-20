import { PriceResult } from './types';
import { PRODUCTS } from './config';
import { scrapeStub } from './scrapers/stub';

export async function checkPrices(): Promise<PriceResult[]> {
  const results: PriceResult[] = [];

  // For now, just use stub scraper for each product
  for (const [model, config] of Object.entries(PRODUCTS)) {
    try {
      const result = await scrapeStub(config.sku);
      results.push(result);
    } catch (error) {
      console.error(`Error scraping ${model}:`, error);
      // Continue with other products even if one fails
    }
  }

  return results;
}
