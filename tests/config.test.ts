import { describe, it, expect } from '@jest/globals';
import { PRODUCTS } from '../src/config';

describe('Config Module', () => {
  it('should define Samsung Tab S10 FE product with correct name and threshold', () => {
    expect(PRODUCTS['samsung-tab-s10-fe-256gb']).toBeDefined();
    expect(PRODUCTS['samsung-tab-s10-fe-256gb'].name).toBe('Samsung Galaxy Tab S10 FE (256GB WiFi, 12GB RAM)');
    expect(PRODUCTS['samsung-tab-s10-fe-256gb'].threshold).toBe(350);
  });

  it('should have exactly 1 product defined', () => {
    expect(Object.keys(PRODUCTS)).toHaveLength(1);
  });
});
