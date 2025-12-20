import { PriceResult, ScraperFunction } from './types';
import { PRODUCTS } from './config';

export async function checkPrices(scrapers: ScraperFunction[]): Promise<PriceResult[]> {
  const results: PriceResult[] = [];

  // Run each scraper for each product
  for (const [model, config] of Object.entries(PRODUCTS)) {
    for (const scraper of scrapers) {
      try {
        const result = await scraper(config.sku);
        results.push(result);
      } catch (error) {
        console.error(`Error scraping ${model}:`, error);
        // Continue with other scrapers even if one fails
      }
    }
  }

  return results;
}
