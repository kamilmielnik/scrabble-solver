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
    [['ro'], 'ro', Locale.RO_RO],
    [['ro-RO'], 'ro-RO', Locale.RO_RO],
    [['de-DE'], 'de-DE', Locale.DE_DE],
    [['tr'], 'tr', Locale.TR_TR],
    [['es'], 'es', Locale.ES_ES],
    [['ja'], 'ja', Locale.EN_US],
  ])('maps languages %j to the matching locale', (languages, language, expected) => {
    withNavigator({ language, languages }, () => {
      expect(guessLocale()).toBe(expected);
    });
  });

  it('prefers a secondary browser language with a dedicated rule over the primary one', () => {
    withNavigator({ language: 'en-US', languages: ['en-US', 'pl'] }, () => {
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
