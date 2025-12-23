export interface ProductConfig {
  name: string;
  threshold: number;
}

export const PRODUCTS: Record<string, ProductConfig> = {
  'samsung-tab-s10-fe-256gb': {
    name: 'Samsung Galaxy Tab S10 FE (256GB WiFi, 12GB RAM)',
    threshold: 350
  }
};
