import { describe, expect, it } from 'bun:test';

import { isMultiplierBingo } from './isMultiplierBingo';

describe('isMultiplierBingo', () => {
  it.each([
    ['a multiplier', { multiplier: 2 }],
    ['a fractional multiplier', { multiplier: 1.5 }],
    ['extra fields', { extra: 1, multiplier: 2 }],
    ['a bingo also holding a score', { multiplier: 2, score: 50 }],
  ])('accepts %s', (_name, value) => {
    expect(isMultiplierBingo(value)).toBe(true);
  });

  it('checks the type only, since bingos come from static configs', () => {
    expect(isMultiplierBingo({ multiplier: Number.NaN })).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 2],
    ['NaN', Number.NaN],
    ['text', 'multiplier'],
    ['an empty object', {}],
    ['an array', [2]],
    ['a score bingo', { score: 50 }],
    ['a text multiplier', { multiplier: '2' }],
    ['a null multiplier', { multiplier: null }],
    ['an undefined multiplier', { multiplier: undefined }],
  ])('rejects %s', (_name, value) => {
    expect(isMultiplierBingo(value)).toBe(false);
  });
});
