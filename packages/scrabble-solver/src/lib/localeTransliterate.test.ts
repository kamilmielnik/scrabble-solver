import { Locale } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

describe('localeTransliterate', () => {
  it.each([
    { locale: Locale.ES_ES, word: 'bañó', expected: 'baño' },
    { locale: Locale.FR_FR, word: 'très', expected: 'tres' },
    { locale: Locale.PL_PL, word: 'źdźbło', expected: 'źdźbło' },
    { locale: Locale.RO_RO, word: 'mămăligă', expected: 'mamaliga' },
  ])(`[$locale] "$word"`, ({ locale, word, expected }) => {
    expect(localeTransliterate(locale, word)).toEqual(expected);
  });
});
