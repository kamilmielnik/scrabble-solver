import { Locale } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

describe('localeTransliterate', () => {
  it.each([
    { locale: Locale.CA_ES, word: 'cançó', expected: 'canço' },
    { locale: Locale.CA_ES, word: 'CANÇÓ', expected: 'CANÇO' },
    { locale: Locale.CA_ES, word: 'qüestió', expected: 'questio' },
    { locale: Locale.CA_ES, word: 'aïllament', expected: 'aillament' },
    { locale: Locale.CA_ES, word: 'cel·la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel.la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel•la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel∙la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel‧la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel⋅la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'cel\u0387la', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'ceŀla', expected: 'cel·la' },
    { locale: Locale.CA_ES, word: 'CEĿLA', expected: 'CEL·LA' },
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

  it.each([
    { locale: Locale.CA_ES, word: 'cançó', expected: 'canço' },
    { locale: Locale.CA_ES, word: 'CANÇÓ', expected: 'CANÇO' },
    { locale: Locale.ES_ES, word: 'bañó', expected: 'baño' },
    { locale: Locale.PL_PL, word: 'źdźbło', expected: 'źdźbło' },
  ])(`[$locale] keeps the letters of decomposed "$word"`, ({ locale, word, expected }) => {
    expect(localeTransliterate(locale, word.normalize('NFD'))).toEqual(expected);
  });
});
