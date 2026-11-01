import { Locale } from '@scrabble-solver/types';

import { guessLocale } from './lib';

describe('guessLocale', () => {
  it.each([
    [['pl'], 'pl', Locale.PL_PL],
    [['pl-PL'], 'pl-PL', Locale.PL_PL],
    [['en-GB'], 'en-GB', Locale.EN_GB],
    [['fa'], 'fa', Locale.FA_IR],
    [['fa-IR'], 'fa-IR', Locale.FA_IR],
    [['fr-FR'], 'fr-FR', Locale.FR_FR],
    [['ca'], 'ca', Locale.CA_ES],
    [['ca-ES'], 'ca-ES', Locale.CA_ES],
    [['ro'], 'ro', Locale.RO_RO],
    [['ro-RO'], 'ro-RO', Locale.RO_RO],
    [['de-DE'], 'de-DE', Locale.DE_DE],
    [['tr'], 'tr', Locale.TR_TR],
    [['es'], 'es', Locale.ES_ES],
    [['ja'], 'ja', Locale.EN_US],
    [['ca-ES-valencia'], 'ca-ES-valencia', Locale.CA_ES],
    [['ca-AD'], 'ca-AD', Locale.CA_ES],
    [['ro-MD'], 'ro-MD', Locale.RO_RO],
    [['de-AT'], 'de-AT', Locale.DE_DE],
    [['es-MX'], 'es-MX', Locale.ES_ES],
    [['en'], 'en', Locale.EN_US],
    [['en-CA'], 'en-CA', Locale.EN_US],
    [['en-AU'], 'en-AU', Locale.EN_GB],
    [['en-IN'], 'en-IN', Locale.EN_GB],
    [['en-PH'], 'en-PH', Locale.EN_GB],
    [['en-PR'], 'en-PR', Locale.EN_US],
    [['en-us'], 'en-us', Locale.EN_US],
    [['en-US-posix'], 'en-US-posix', Locale.EN_US],
    [['en-Latn-GB'], 'en-Latn-GB', Locale.EN_GB],
    [['caa'], 'caa', Locale.EN_US],
  ])('maps languages %j to the matching locale', (languages, language, expected) => {
    withNavigator({ language, languages }, () => {
      expect(guessLocale()).toBe(expected);
    });
  });

  it.each([
    [['en-US', 'pl'], Locale.EN_US],
    [['es-ES', 'ca'], Locale.ES_ES],
    [['ca', 'en-GB'], Locale.CA_ES],
    [['ca', 'fr-FR'], Locale.CA_ES],
    [['ja', 'pl'], Locale.PL_PL],
  ])('follows the order of browser languages %j', (languages, expected) => {
    withNavigator({ language: languages[0], languages }, () => {
      expect(guessLocale()).toBe(expected);
    });
  });

  it('skips a language it cannot parse', () => {
    withNavigator({ language: 'en_GB', languages: ['en_GB', 'pl'] }, () => {
      expect(guessLocale()).toBe(Locale.PL_PL);
    });
  });

  it('falls back to the browser language without a list of languages', () => {
    withNavigator({ language: 'pl-PL', languages: [] }, () => {
      expect(guessLocale()).toBe(Locale.PL_PL);
    });
  });

  it('falls back to en-US without a navigator (SSR)', () => {
    withNavigator(undefined, () => {
      expect(guessLocale()).toBe(Locale.EN_US);
    });
  });
});

function withNavigator(value: unknown, run: () => void): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')!;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value, writable: true });

  try {
    run();
  } finally {
    Object.defineProperty(globalThis, 'navigator', descriptor);
  }
}
