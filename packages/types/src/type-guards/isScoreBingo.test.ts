import { describe, expect, it } from 'bun:test';

import { isScoreBingo } from './isScoreBingo';

describe('isScoreBingo', () => {
  it.each([
    ['a score', { score: 50 }],
    ['a score of zero', { score: 0 }],
    ['extra fields', { extra: 1, score: 50 }],
    ['a bingo also holding a multiplier', { multiplier: 2, score: 50 }],
  ])('accepts %s', (_name, value) => {
    expect(isScoreBingo(value)).toBe(true);
  });

  it('checks the type only, since bingos come from static configs', () => {
    expect(isScoreBingo({ score: Number.NaN })).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 50],
    ['NaN', Number.NaN],
    ['text', 'score'],
    ['an empty object', {}],
    ['an array', [50]],
    ['a multiplier bingo', { multiplier: 2 }],
    ['a text score', { score: '50' }],
    ['a null score', { score: null }],
    ['an undefined score', { score: undefined }],
  ])('rejects %s', (_name, value) => {
    expect(isScoreBingo(value)).toBe(false);
  });
});
