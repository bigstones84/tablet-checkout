export interface ProductConfig {
  sku: string;
  threshold: number;
}

export const PRODUCTS: Record<string, ProductConfig> = {
  '128GB': {
    sku: 'ZACH0112SE',
    threshold: 350
  },
  '256GB': {
    sku: 'ZACH0204SE',
    threshold: 400
  }
};
