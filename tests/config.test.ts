import { describe, it, expect } from '@jest/globals';
import { PRODUCTS } from '../src/config';

describe('Config Module', () => {
  it('should define 128GB product with correct SKU and threshold', () => {
    expect(PRODUCTS['128GB']).toBeDefined();
    expect(PRODUCTS['128GB'].sku).toBe('ZACH0112SE');
    expect(PRODUCTS['128GB'].threshold).toBe(350);
  });

  it('should define 256GB product with correct SKU and threshold', () => {
    expect(PRODUCTS['256GB']).toBeDefined();
    expect(PRODUCTS['256GB'].sku).toBe('ZACH0204SE');
    expect(PRODUCTS['256GB'].threshold).toBe(400);
  });

  it('should have exactly 2 products defined', () => {
    expect(Object.keys(PRODUCTS)).toHaveLength(2);
  });
});
