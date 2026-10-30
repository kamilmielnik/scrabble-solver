import { Config, Game, Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { games, getConfig, hasConfig, languages } from './index';

type LanguageName = keyof typeof languages;

const CONFIGS: Record<LanguageName, Config> = { ...languages };

const SUPPORTED_CONFIGS: [LanguageName, Game, Locale][] = [
  ['englishGbCrossplay', Game.Crossplay, Locale.EN_GB],
  ['englishUsCrossplay', Game.Crossplay, Locale.EN_US],
  ['turkishKelimelik', Game.Kelimelik, Locale.TR_TR],
  ['englishGbLetterLeague', Game.LetterLeague, Locale.EN_GB],
  ['englishUsLetterLeague', Game.LetterLeague, Locale.EN_US],
  ['englishGbLiteraki', Game.Literaki, Locale.EN_GB],
  ['englishUsLiteraki', Game.Literaki, Locale.EN_US],
  ['polishLiteraki', Game.Literaki, Locale.PL_PL],
  ['germanScrabble', Game.Scrabble, Locale.DE_DE],
  ['englishGbScrabble', Game.Scrabble, Locale.EN_GB],
  ['englishUsScrabble', Game.Scrabble, Locale.EN_US],
  ['spanishScrabble', Game.Scrabble, Locale.ES_ES],
  ['persianScrabble', Game.Scrabble, Locale.FA_IR],
  ['frenchScrabble', Game.Scrabble, Locale.FR_FR],
  ['polishScrabble', Game.Scrabble, Locale.PL_PL],
  ['romanianScrabble', Game.Scrabble, Locale.RO_RO],
  ['turkishScrabble', Game.Scrabble, Locale.TR_TR],
  ['englishGbScrabbleDuel', Game.ScrabbleDuel, Locale.EN_GB],
  ['englishUsScrabbleDuel', Game.ScrabbleDuel, Locale.EN_US],
  ['englishGbSuperScrabble', Game.SuperScrabble, Locale.EN_GB],
  ['englishUsSuperScrabble', Game.SuperScrabble, Locale.EN_US],
  ['romanianSuperScrabble', Game.SuperScrabble, Locale.RO_RO],
  ['englishGbWordfeud', Game.Wordfeud, Locale.EN_GB],
  ['englishUsWordfeud', Game.Wordfeud, Locale.EN_US],
  ['polishWyrazy', Game.Wyrazy, Locale.PL_PL],
];

const UNSUPPORTED_PAIRS = getUnsupportedPairs();

describe('package exports', () => {
  it('exports one base config per game', () => {
    const exportedGames = Object.values(games).map(({ game }) => game);

    expect(exportedGames.toSorted()).toEqual(Object.values(Game).toSorted());
  });

  it('exports exactly the supported language configs, each as a Config instance', () => {
    expect(Object.keys(languages).toSorted()).toEqual(SUPPORTED_CONFIGS.map(([name]) => name).toSorted());

    for (const config of Object.values(languages)) {
      expect(config).toBeInstanceOf(Config);
    }
  });

  it('never defines the same game and locale twice, which getConfig would silently hide', () => {
    const pairs = Object.values(languages).map(({ game, locale }) => `${game}/${locale}`);

    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it('has a game for every locale, so no locale is left without a config', () => {
    const locales = new Set(Object.values(languages).map(({ locale }) => locale));

    expect([...locales].toSorted()).toEqual(Object.values(Locale).toSorted());
  });
});

describe('getConfig', () => {
  it.each(SUPPORTED_CONFIGS)('returns %s for %s in %s', (name, game, locale) => {
    expect(getConfig(game, locale)).toBe(CONFIGS[name]);
  });

  it.each(UNSUPPORTED_PAIRS)('throws for %s in %s', (game, locale) => {
    expect(() => getConfig(game, locale)).toThrow(new Error(`No game "${game}" in "${locale}"`));
  });

  it('names both the game and the locale in the error', () => {
    expect(() => getConfig(Game.Wyrazy, Locale.EN_US)).toThrow('No game "wyrazy" in "en-US"');
  });

  it('throws for a game and a locale that do not exist', () => {
    expect(() => getConfig('chess' as Game, 'xx-XX' as Locale)).toThrow('No game "chess" in "xx-XX"');
  });
});

describe('hasConfig', () => {
  it.each(SUPPORTED_CONFIGS)('is true for %s, which is %s in %s', (_name, game, locale) => {
    expect(hasConfig(game, locale)).toBe(true);
  });

  it.each(UNSUPPORTED_PAIRS)('is false for %s in %s', (game, locale) => {
    expect(hasConfig(game, locale)).toBe(false);
  });

  it('is false for a game and a locale that do not exist', () => {
    expect(hasConfig('chess' as Game, Locale.EN_US)).toBe(false);
    expect(hasConfig(Game.Scrabble, 'xx-XX' as Locale)).toBe(false);
  });
});

function getUnsupportedPairs(): [Game, Locale][] {
  const supported = new Set(SUPPORTED_CONFIGS.map(([, game, locale]) => `${game}/${locale}`));
  const allPairs = Object.values(Game).flatMap((game) => {
    return Object.values(Locale).map((locale): [Game, Locale] => [game, locale]);
  });

  return allPairs.filter(([game, locale]) => !supported.has(`${game}/${locale}`));
}
