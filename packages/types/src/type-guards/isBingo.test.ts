import { describe, expect, it } from 'bun:test';

import { isBingo } from './isBingo';

describe('isBingo', () => {
  it.each([
    ['a score bingo', { score: 50 }],
    ['a multiplier bingo', { multiplier: 2 }],
    ['both fields', { multiplier: 2, score: 50 }],
    ['a valid multiplier beside a malformed score', { multiplier: 2, score: '50' }],
    ['a valid score beside a malformed multiplier', { multiplier: '2', score: 50 }],
    ['extra fields', { extra: 1, score: 50 }],
  ])('accepts %s', (_name, value) => {
    expect(isBingo(value)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 50],
    ['NaN', Number.NaN],
    ['text', 'bingo'],
    ['an empty object', {}],
    ['an array', [50]],
    ['neither field being valid', { multiplier: '2', score: '50' }],
    ['unrelated fields', { points: 50 }],
  ])('rejects %s', (_name, value) => {
    expect(isBingo(value)).toBe(false);
  });
});
