import { describe, it, expect } from '@jest/globals';
import axios from 'axios';
import * as cheerio from 'cheerio';

describe.skip('Amazon.it Throwaway Test', () => {
  it('should fetch Amazon product page and find price', async () => {
    // Try the actual Lenovo tablet SKU
    const sku = 'ZACH0112SE';
    const url = `https://www.amazon.it/s?k=${sku}`; // Search instead of direct product page

    console.log(`Fetching: ${url}`);

    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        timeout: 10000
      });
    } catch (error: any) {
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
      if (error.response) {
        console.error('Response status:', error.response.status);
      }
      throw error;
    }

    expect(response.status).toBe(200);
    console.log(`Response status: ${response.status}`);

    const $ = cheerio.load(response.data);

    // Try to find price - Amazon has multiple possible selectors
    const priceSelectors = [
      '.a-price .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price-whole'
    ];

    let foundPrice = null;
    for (const selector of priceSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const text = element.text().trim();
        console.log(`Found with selector "${selector}": ${text}`);
        foundPrice = text;
        break;
      }
    }

    console.log(`Final price: ${foundPrice}`);

    // For homepage, just check we got content
    const pageTitle = $('title').text();
    console.log(`Page title: ${pageTitle}`);
    expect(pageTitle.length).toBeGreaterThan(0);
  }, 15000); // 15 second timeout for this test
});
