export interface RetailerConfig {
  amazon?: { asin: string };
  trovaprezzi?: { url: string };
  idealo?: { productId: string };
  // Add more retailers as needed
}

export interface ProductConfig {
  name: string;
  threshold: number;
  retailers: RetailerConfig;
}

export const PRODUCTS: Record<string, ProductConfig> = {
  'samsung-tab-s10-fe-256gb': {
    name: 'Samsung Galaxy Tab S10 FE (256GB WiFi, 12GB RAM)',
    threshold: 350,
    retailers: {
      amazon: { asin: 'B0F3885QQK' }
      // Other retailers can be added here as they're implemented
    }
  },
  // Test product for unit tests
  'test-product': {
    name: 'Test Product',
    threshold: 350,
    retailers: {
      amazon: { asin: 'TEST_ASIN_123' }
    }
  }
};
