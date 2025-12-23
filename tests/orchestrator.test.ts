import { describe, it, expect } from '@jest/globals';
import { checkPrices } from '../src/orchestrator';
import { createMockScraper } from './helpers';

describe('Orchestrator', () => {
  it('should run scrapers and return results', async () => {
    const mockScraper = createMockScraper({
      site: 'MockSite',
      price: 299,
      available: true
    });

    const results = await checkPrices([mockScraper]);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return PriceResult objects', async () => {
    const mockScraper = createMockScraper({
      site: 'MockSite',
      price: 299,
      available: true
    });

    const results = await checkPrices([mockScraper]);

    results.forEach((result) => {
      expect(result).toHaveProperty('site');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('available');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('productKey');
    });
  });

  it('should run scraper for each product', async () => {
    const mockScraper = createMockScraper({
      site: 'MockSite',
      price: 299,
      available: true
    });

    const results = await checkPrices([mockScraper]);

    // Should have one result per product (2 products configured: samsung + test-product)
    expect(results.length).toBe(2);
  });

  it('should run multiple scrapers for each product', async () => {
    const scraper1 = createMockScraper({
      site: 'Site1',
      price: 100,
      available: true
    });

    const scraper2 = createMockScraper({
      site: 'Site2',
      price: 200,
      available: true
    });

    const results = await checkPrices([scraper1, scraper2]);

    // Should have results from both scrapers for each product (2 products * 2 scrapers = 4)
    expect(results.length).toBe(4);
  });

  it('should handle scraper errors gracefully', async () => {
    const throwingScraper = async () => {
      throw new Error('Scraper failed');
    };

    const workingScraper = createMockScraper({
      site: 'MockSite',
      price: 299,
      available: true
    });

    const results = await checkPrices([throwingScraper, workingScraper]);

    // Should still have results from working scraper (2 products * 1 working scraper = 2)
    expect(results.length).toBe(2);
  });
});
