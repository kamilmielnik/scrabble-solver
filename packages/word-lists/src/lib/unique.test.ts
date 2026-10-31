import { describe, expect, it } from 'bun:test';

import { unique } from './unique';

describe('unique', () => {
  it('returns an empty array for an empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('keeps the first occurrence of every value in the original order', () => {
    expect(unique(['c', 'a', 'c', 'b', 'a'])).toEqual(['c', 'a', 'b']);
  });

  it('treats differently cased words as different values', () => {
    expect(unique(['aa', 'AA'])).toEqual(['aa', 'AA']);
  });

  it('collapses repeated NaN values', () => {
    expect(unique([Number.NaN, 1, Number.NaN])).toEqual([Number.NaN, 1]);
  });

  it('compares objects by reference', () => {
    const shared = { word: 'aa' };

    expect(unique([shared, shared, { word: 'aa' }])).toEqual([shared, { word: 'aa' }]);
  });

  it('leaves the input array untouched', () => {
    const words = ['aa', 'aa'];

    unique(words);

    expect(words).toEqual(['aa', 'aa']);
  });
});
