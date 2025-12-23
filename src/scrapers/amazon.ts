import axios from 'axios';
import * as cheerio from 'cheerio';
import currency from 'currency.js';
import { PriceResult } from '../types';
import { PRODUCTS } from '../config';

export async function scrapeAmazon(productKey: string): Promise<PriceResult> {
  const productConfig = PRODUCTS[productKey];

  if (!productConfig) {
    console.error(`Product not found in config: ${productKey}`);
    return {
      site: 'Amazon.it',
      price: null,
      available: false,
      url: `https://www.amazon.it/s?k=${productKey}`,
      productKey
    };
  }

  const asin = productConfig.retailers.amazon?.asin;

  if (!asin) {
    console.error(`No Amazon ASIN configured for product: ${productKey}`);
    return {
      site: 'Amazon.it',
      price: null,
      available: false,
      url: `https://www.amazon.it/s?k=${productKey}`,
      productKey
    };
  }

  const url = `https://www.amazon.it/dp/${asin}`;

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

    // Get the main price from the buy box (not from suggestions or other sellers)
    // Try multiple selectors to find the main NEW price
    let priceText = '';

    // Try the main buy box price first
    priceText = $('#corePrice_desktop .a-price .a-offscreen').first().text().trim();

    // Fallback to other common price locations
    if (!priceText) {
      priceText = $('.a-price[data-a-size="xl"] .a-offscreen').first().text().trim();
    }
    if (!priceText) {
      priceText = $('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen').first().text().trim();
    }
    if (!priceText) {
      // Last resort: first price in the buy box area (but skip "Consider these items" section)
      priceText = $('#centerCol .a-price .a-offscreen').first().text().trim();
    }

    if (!priceText) {
      return {
        site: 'Amazon.it',
        price: null,
        available: false,
        url,
        productKey
      };
    }

    const price = parseItalianPrice(priceText);

    if (price === null || price <= 0) {
      return {
        site: 'Amazon.it',
        price: null,
        available: false,
        url,
        productKey
      };
    }

    return {
      site: 'Amazon.it',
      price,
      available: true,
      url,
      productKey
    };
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return {
      site: 'Amazon.it',
      price: null,
      available: false,
      url,
      productKey
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
