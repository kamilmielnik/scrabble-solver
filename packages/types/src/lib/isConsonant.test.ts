import { describe, expect, it } from 'bun:test';

import { Locale } from '../Locale';

import { isConsonant } from './isConsonant';
import { isVowel } from './isVowel';

describe('isConsonant and isVowel', () => {
  it('treats y as a consonant in Turkish', () => {
    expect(isConsonant('y', Locale.TR_TR)).toBe(true);
    expect(isVowel('y', Locale.TR_TR)).toBe(false);
  });

  it.each(Object.values(Locale).filter((locale) => locale !== Locale.TR_TR))('treats y as a vowel in %s', (locale) => {
    expect(isConsonant('y', locale)).toBe(false);
    expect(isVowel('y', locale)).toBe(true);
  });

  it('keeps every other letter in the same group in Turkish', () => {
    expect(isConsonant('k', Locale.TR_TR)).toBe(true);
    expect(isVowel('k', Locale.TR_TR)).toBe(false);
    expect(isConsonant('ı', Locale.TR_TR)).toBe(false);
    expect(isVowel('ı', Locale.TR_TR)).toBe(true);
  });

  it('treats two-letter tiles and characters outside the alphabet as neither', () => {
    expect(isConsonant('ch', Locale.ES_ES)).toBe(false);
    expect(isVowel('ch', Locale.ES_ES)).toBe(false);
    expect(isConsonant('ب', Locale.FA_IR)).toBe(false);
    expect(isVowel('ب', Locale.FA_IR)).toBe(false);
  });
});
