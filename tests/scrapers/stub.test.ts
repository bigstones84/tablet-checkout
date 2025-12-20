import { describe, it, expect } from '@jest/globals';
import { scrapeStub } from '../../src/scrapers/stub';

describe('Stub Scraper', () => {
  it('should return a valid PriceResult', async () => {
    const result = await scrapeStub('ZACH0112SE');

    expect(result).toBeDefined();
    expect(result.site).toBe('Stub');
    expect(result.price).toBe(299);
    expect(result.available).toBe(true);
    expect(result.url).toContain('ZACH0112SE');
  });

  it('should include the SKU in the URL', async () => {
    const result = await scrapeStub('ZACH0204SE');

    expect(result.url).toContain('ZACH0204SE');
  });
});
