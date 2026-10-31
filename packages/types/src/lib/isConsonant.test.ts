import { describe, expect, it } from 'bun:test';

import { Locale } from '../Locale';

import { isConsonant } from './isConsonant';

describe('isConsonant', () => {
  it('treats y as a consonant in Turkish', () => {
    expect(isConsonant('y', Locale.TR_TR)).toBe(true);
  });

  it.each(Object.values(Locale).filter((locale) => locale !== Locale.TR_TR))(
    'does not treat y as a consonant in %s',
    (locale) => {
      expect(isConsonant('y', locale)).toBe(false);
    },
  );

  it('keeps every other letter in the same group in Turkish', () => {
    expect(isConsonant('k', Locale.TR_TR)).toBe(true);
    expect(isConsonant('ı', Locale.TR_TR)).toBe(false);
  });

  it('treats two-letter tiles and letters outside the groups as no consonants', () => {
    expect(isConsonant('ch', Locale.ES_ES)).toBe(false);
    expect(isConsonant('ب', Locale.FA_IR)).toBe(false);
  });
});
