import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { scrapeAmazon } from '../../src/scrapers/amazon';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Amazon Scraper', () => {
  const mockHtml = `
    <html>
      <head><title>Amazon.it : ZACH0112SE</title></head>
      <body>
        <span class="a-price">
          <span class="a-offscreen">340,50 €</span>
        </span>
      </body>
    </html>
  `;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape Amazon and return price', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: mockHtml
    });

    const result = await scrapeAmazon('ZACH0112SE');

    expect(result.site).toBe('Amazon.it');
    expect(result.price).toBe(340.5);
    expect(result.available).toBe(true);
    expect(result.url).toContain('ZACH0112SE');
  });

  it('should parse Italian price format correctly', async () => {
    const htmlWithComma = mockHtml.replace('340,50', '1.234,56');
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: htmlWithComma
    });

    const result = await scrapeAmazon('TEST');

    expect(result.price).toBe(1234.56);
  });

  it('should return null price when not found', async () => {
    const htmlNoPrice = '<html><body>No price here</body></html>';
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: htmlNoPrice
    });

    const result = await scrapeAmazon('TEST');

    expect(result.price).toBe(null);
    expect(result.available).toBe(false);
  });

  it('should use realistic headers', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: mockHtml
    });

    await scrapeAmazon('TEST');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': expect.stringContaining('Mozilla'),
          'Accept-Language': expect.stringContaining('it')
        })
      })
    );
  });

  it('should handle network errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const result = await scrapeAmazon('TEST');

    expect(result.price).toBe(null);
    expect(result.available).toBe(false);
  });
});
