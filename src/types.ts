export interface PriceResult {
  site: string;
  price: number | null;
  available: boolean;
  url: string;
}

export interface ScraperFunction {
  (sku: string): Promise<PriceResult>;
}
