import { describe, expect, it } from 'bun:test';

import { Locale } from '../Locale';

import { isLocale } from './isLocale';

describe('isLocale', () => {
  it.each(Object.values(Locale))('accepts %s', (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 0],
    ['NaN', Number.NaN],
    ['empty text', ''],
    ['an unsupported locale', 'it-IT'],
    ['a language without a region', 'en'],
    ['a tag in another case', 'en-us'],
    ['a tag with an underscore', 'en_US'],
    ['an enum key rather than its value', 'EN_US'],
    ['a game', 'scrabble'],
    ['an object', {}],
    ['an array holding a locale', ['en-US']],
  ])('rejects %s', (_name, value) => {
    expect(isLocale(value)).toBe(false);
  });
});
