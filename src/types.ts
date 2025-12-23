export interface PriceResult {
  site: string;
  price: number | null;
  available: boolean;
  url: string;
  productKey: string;
}

export interface ScraperFunction {
  (productKey: string): Promise<PriceResult>;
}
