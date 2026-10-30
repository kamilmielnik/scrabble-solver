import { describe, expect, it } from 'bun:test';

import { isObject } from './isObject';

describe('isObject', () => {
  it.each([
    ['an object literal', {}],
    ['an object with fields', { a: 1 }],
    ['an object without a prototype', Object.create(null)],
    ['a class instance', new Error('x')],
    ['a date', new Date(0)],
  ])('accepts %s', (_name, value) => {
    expect(isObject(value)).toBe(true);
  });

  it('accepts arrays, so callers needing a plain object check for them separately', () => {
    expect(isObject([])).toBe(true);
    expect(isObject([1, 2])).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 1],
    ['NaN', Number.NaN],
    ['text', 'text'],
    ['empty text', ''],
    ['a boolean', true],
    ['a symbol', Symbol('x')],
    ['a function', () => undefined],
  ])('rejects %s', (_name, value) => {
    expect(isObject(value)).toBe(false);
  });
});
