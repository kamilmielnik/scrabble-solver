import { describe, expect, it } from 'bun:test';

import { Locale } from '../Locale';

import { isConsonant } from './isConsonant';
import { isVowel } from './isVowel';

const TURKISH_VOWELS = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
const LOCALES_WITH_VOWEL_Y = Object.values(Locale).filter((locale) => locale !== Locale.TR_TR);

describe('isVowel', () => {
  it('does not treat y as a vowel in Turkish', () => {
    expect(isVowel('y', Locale.TR_TR)).toBe(false);
  });

  it.each(LOCALES_WITH_VOWEL_Y)('treats y as a vowel in %s', (locale) => {
    expect(isVowel('y', locale)).toBe(true);
  });

  it.each(Object.values(Locale))('never counts y as both a vowel and a consonant in %s', (locale) => {
    expect(isVowel('y', locale)).not.toBe(isConsonant('y', locale));
  });

  it.each(TURKISH_VOWELS)('keeps %s as a vowel in Turkish', (letter) => {
    expect(isVowel(letter, Locale.TR_TR)).toBe(true);
  });

  it('does not treat a consonant as a vowel', () => {
    expect(isVowel('k', Locale.TR_TR)).toBe(false);
    expect(isVowel('k', Locale.EN_US)).toBe(false);
  });

  it('treats two-letter tiles and letters outside the groups as no vowels', () => {
    expect(isVowel('ch', Locale.ES_ES)).toBe(false);
    expect(isVowel('ب', Locale.FA_IR)).toBe(false);
  });
});
