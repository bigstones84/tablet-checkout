import { PriceResult, ScraperFunction } from './types';
import { PRODUCTS } from './config';

export async function checkPrices(scrapers: ScraperFunction[]): Promise<PriceResult[]> {
  const results: PriceResult[] = [];

  // Run each scraper for each product
  for (const [productKey, config] of Object.entries(PRODUCTS)) {
    for (const scraper of scrapers) {
      try {
        const result = await scraper(productKey);
        results.push(result);
      } catch (error) {
        console.error(`Error scraping ${config.name}:`, error);
        // Continue with other scrapers even if one fails
      }
    }
  }

  return results;
}
