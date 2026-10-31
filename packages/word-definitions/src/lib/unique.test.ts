import { describe, expect, it } from 'bun:test';

import { unique } from './unique';

describe('unique', () => {
  it('returns an empty array for an empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('keeps an array without duplicates as it is', () => {
    expect(unique(['b', 'a', 'c'])).toEqual(['b', 'a', 'c']);
  });

  it('keeps the first occurrence of each value, in the original order', () => {
    expect(unique(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
  });

  it('treats strings that differ by case or by unicode form as different values', () => {
    expect(unique(['a', 'A', 'é', 'é'])).toEqual(['a', 'A', 'é', 'é']);
  });

  it('compares objects by identity', () => {
    const shared = { word: 'a' };

    expect(unique([shared, shared, { word: 'a' }])).toEqual([shared, { word: 'a' }]);
  });

  it('treats NaN as equal to itself', () => {
    expect(unique([Number.NaN, Number.NaN])).toEqual([Number.NaN]);
  });

  it('does not mutate the input', () => {
    const input = ['a', 'a'];

    expect(unique(input)).not.toBe(input);
    expect(input).toEqual(['a', 'a']);
  });
});
