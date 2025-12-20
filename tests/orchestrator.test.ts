import { describe, it, expect } from '@jest/globals';
import { checkPrices } from '../src/orchestrator';
import { PriceResult } from '../src/types';

describe('Orchestrator', () => {
  it('should run scrapers and return results', async () => {
    const results = await checkPrices();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return PriceResult objects', async () => {
    const results = await checkPrices();

    results.forEach((result: PriceResult) => {
      expect(result).toHaveProperty('site');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('available');
      expect(result).toHaveProperty('url');
    });
  });

  it('should identify prices below threshold', async () => {
    const results = await checkPrices();

    // Stub scraper returns 299, which is below both thresholds (350/400)
    const belowThreshold = results.filter(r =>
      r.price !== null && r.price < 350
    );

    expect(belowThreshold.length).toBeGreaterThan(0);
  });
});
