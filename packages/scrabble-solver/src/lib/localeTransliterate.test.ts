import { Locale } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

describe('localeTransliterate', () => {
  it.each([
    { locale: Locale.ES_ES, word: 'bañó', expected: 'baño' },
    { locale: Locale.ES_ES, word: 'pingüino', expected: 'pinguino' },
    { locale: Locale.FR_FR, word: 'très', expected: 'tres' },
    { locale: Locale.FR_FR, word: 'garçon', expected: 'garcon' },
    { locale: Locale.FR_FR, word: 'œuf', expected: 'oeuf' },
    { locale: Locale.FR_FR, word: 'ex æquo', expected: 'ex aequo' },
    { locale: Locale.PL_PL, word: 'źdźbło', expected: 'źdźbło' },
    { locale: Locale.RO_RO, word: 'mămăligă', expected: 'mamaliga' },
    { locale: Locale.RO_RO, word: 'așteaptă', expected: 'asteapta' },
  ])(`[$locale] "$word"`, ({ locale, word, expected }) => {
    expect(localeTransliterate(locale, word)).toEqual(expected);
  });
});
