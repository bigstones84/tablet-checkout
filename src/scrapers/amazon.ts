import axios from 'axios';
import * as cheerio from 'cheerio';
import currency from 'currency.js';
import { PriceResult } from '../types';

export async function scrapeAmazon(sku: string): Promise<PriceResult> {
  const url = `https://www.amazon.it/s?k=${sku}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Try to find price using Amazon's price selector
    const priceElement = $('.a-price .a-offscreen').first();

    if (priceElement.length === 0) {
      return {
        site: 'Amazon.it',
        price: null,
        available: false,
        url
      };
    }

    const priceText = priceElement.text().trim();
    const price = parseItalianPrice(priceText);

    return {
      site: 'Amazon.it',
      price,
      available: price !== null,
      url
    };
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return {
      site: 'Amazon.it',
      price: null,
      available: false,
      url
    };
  }
}

function parseItalianPrice(priceText: string): number | null {
  try {
    // Italian format uses comma as decimal separator and dot as thousands separator
    // currency.js supports this with decimal: ',' and separator: '.'
    const parsed = currency(priceText, {
      decimal: ',',
      separator: '.',
      symbol: '€',
      pattern: '# !'
    });

    return parsed.value;
  } catch (error) {
    console.error('Error parsing price:', priceText, error);
    return null;
  }
}
