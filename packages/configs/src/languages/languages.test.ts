/* eslint-disable max-lines */

import { BONUS_CHARACTER, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import { type Config, type ConfigJson, Cell, isConsonant, isVowel, Locale, Tile } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import * as games from '../games';

import * as languages from './index';

type GameConfig = Omit<ConfigJson, 'locale' | 'tiles'>;
type GameName = keyof typeof games;
type LanguageName = keyof typeof languages;

const MOVE_GENERATOR_MAX_ALPHABET_SIZE = 64;
const HIGHEST_TILE_SCORE = 10;

const ARABIC_BLOCK_START = 0x0600;
const ARABIC_BLOCK_END = 0x06ff;
const ARABIC_KAF = 0x0643;
const ARABIC_YEH = 0x064a;
const PERSIAN_KAF = 0x06a9;
const PERSIAN_YEH = 0x06cc;

const CONFIGS: Record<LanguageName, Config> = { ...languages };
const GAMES: Record<GameName, GameConfig> = { ...games };
const LANGUAGES = Object.entries(CONFIGS) as [LanguageName, Config][];

const BASE_GAMES: Record<LanguageName, GameName> = {
  englishGbCrossplay: 'crossplay',
  englishGbLetterLeague: 'letterLeague',
  englishGbLiteraki: 'literaki',
  englishGbScrabble: 'scrabble',
  englishGbScrabbleDuel: 'scrabbleDuel',
  englishGbSuperScrabble: 'superScrabble',
  englishGbWordfeud: 'wordfeud',
  englishUsCrossplay: 'crossplay',
  englishUsLetterLeague: 'letterLeague',
  englishUsLiteraki: 'literaki',
  englishUsScrabble: 'scrabble',
  englishUsScrabbleDuel: 'scrabbleDuel',
  englishUsSuperScrabble: 'superScrabble',
  englishUsWordfeud: 'wordfeud',
  frenchScrabble: 'scrabble',
  germanScrabble: 'scrabble',
  persianScrabble: 'scrabble',
  polishLiteraki: 'literaki',
  polishScrabble: 'scrabble',
  polishWyrazy: 'wyrazy',
  romanianScrabble: 'scrabble',
  romanianSuperScrabble: 'superScrabble',
  spanishScrabble: 'scrabble',
  turkishKelimelik: 'kelimelik',
  turkishScrabble: 'scrabble',
};

const LOCALES_WITHOUT_LETTER_GROUPS = [Locale.FA_IR];

describe.each(LANGUAGES)('%s', (name, config) => {
  it('is its base game with only the locale and the tiles added', () => {
    const { locale: _locale, name: displayName, tiles, ...rest } = config.toJson();
    const { name: baseDisplayName, ...base } = GAMES[BASE_GAMES[name]];

    expect(rest).toEqual(base);
    expect(displayName).toBe(isLiteraxx(name) ? 'Literaxx' : baseDisplayName);
    expect(tiles.length).toBeGreaterThan(0);
  });

  it('has no duplicate tiles', () => {
    expect(new Set(config.alphabet).size).toBe(config.alphabet.length);
  });

  it('fits the alphabet in what the move generator can pack into a 64-bit mask', () => {
    expect(config.alphabet.length).toBeLessThanOrEqual(MOVE_GENERATOR_MAX_ALPHABET_SIZE);
  });

  it('has tiles of one or two lowercase, composed letters', () => {
    const invalid = config.alphabet.filter((character) => !isTileCharacter(character, config.locale));

    expect(invalid).toEqual([]);
  });

  it('scores every letter between 1 and 10 points', () => {
    const invalid = config.tiles.filter(({ score }) => {
      return !Number.isInteger(score) || score < 1 || score > HIGHEST_TILE_SCORE;
    });

    expect(invalid).toEqual([]);
  });

  it('has a whole, positive count on every tile, or none at all', () => {
    const counts = config.tiles.map(({ count }) => count);
    const counted = counts.filter((count) => count !== undefined);

    expect(counted.every((count) => Number.isInteger(count) && count > 0)).toBe(true);
    expect([0, counts.length]).toContain(counted.length);
  });

  it('gives every colored Literaki field at least one tile that can match it', () => {
    const fieldScores = config.bonuses.flatMap(({ score }) => (score === undefined ? [] : [score]));
    const tileScores = config.tiles.map(({ score }) => score);

    expect(new Set(fieldScores).difference(new Set(tileScores))).toEqual(new Set());
  });
});

describe('English', () => {
  it.each([
    ['englishGbCrossplay', 'englishUsCrossplay'],
    ['englishGbLetterLeague', 'englishUsLetterLeague'],
    ['englishGbLiteraki', 'englishUsLiteraki'],
    ['englishGbScrabble', 'englishUsScrabble'],
    ['englishGbScrabbleDuel', 'englishUsScrabbleDuel'],
    ['englishGbSuperScrabble', 'englishUsSuperScrabble'],
    ['englishGbWordfeud', 'englishUsWordfeud'],
  ] as const)('%s and %s differ only in the locale', (british, american) => {
    const { locale: britishLocale, ...britishConfig } = CONFIGS[british].toJson();
    const { locale: americanLocale, ...americanConfig } = CONFIGS[american].toJson();

    expect(britishConfig).toEqual(americanConfig);
    expect(britishLocale).toBe(Locale.EN_GB);
    expect(americanLocale).toBe(Locale.EN_US);
  });
});

describe('Polish', () => {
  it('applies a colored Literaki field only to a tile of the same color', () => {
    const { polishLiteraki } = languages;
    const centerBonus = polishLiteraki.bonuses.find(({ x, y }) => x === 7 && y === 7);

    expect(centerBonus?.type).toBe(BONUS_CHARACTER);
    expect(centerBonus?.canApply(polishLiteraki, getEmptyCell('ż', 7, 7))).toBe(true);
    expect(centerBonus?.canApply(polishLiteraki, getEmptyCell('a', 7, 7))).toBe(false);
  });
});

describe('Romanian', () => {
  it('doubles the Scrabble bag for Super Scrabble and keeps the scores', () => {
    const doubled = languages.romanianScrabble.tiles.map(({ character, count = 0, score }) => {
      return { character, count: count * 2, score };
    });

    expect(languages.romanianSuperScrabble.tiles).toEqual(doubled);
  });
});

describe('Persian', () => {
  it('uses the isolated letters that the word list is written in, not presentation forms', () => {
    const notBaseLetters = languages.persianScrabble.alphabet.filter((character) => !isArabicBlockLetter(character));

    expect(notBaseLetters).toEqual([]);
  });

  it('uses the Persian kaf and yeh, not the Arabic ones', () => {
    const { alphabet } = languages.persianScrabble;

    expect(alphabet).toContain(String.fromCodePoint(PERSIAN_KAF));
    expect(alphabet).toContain(String.fromCodePoint(PERSIAN_YEH));
    expect(alphabet).not.toContain(String.fromCodePoint(ARABIC_KAF));
    expect(alphabet).not.toContain(String.fromCodePoint(ARABIC_YEH));
  });

  it.todo('makes words spelled with alef madda, such as آباد, playable (see issue #470)');
});

describe('consonant and vowel groups', () => {
  it('has no letter that is both a consonant and a vowel', () => {
    expect(new Set(CONSONANTS).intersection(new Set(VOWELS))).toEqual(new Set());
  });

  it.each(LANGUAGES.filter(([, { locale }]) => !LOCALES_WITHOUT_LETTER_GROUPS.includes(locale)))(
    '%s classifies every single-letter tile',
    (_name, config) => {
      const singleLetters = config.alphabet.filter((character) => character.length === 1);
      const unclassified = singleLetters.filter((character) => !isClassified(character));

      expect(unclassified).toEqual([]);
    },
  );

  it('classifies y as a consonant in Turkish and as a vowel elsewhere', () => {
    expect(isConsonant('y', Locale.TR_TR)).toBe(true);
    expect(isVowel('y', Locale.EN_US)).toBe(true);
  });
});

function getEmptyCell(character: string, x: number, y: number): Cell {
  return new Cell({ tile: new Tile({ character }), x, y });
}

function isArabicBlockLetter(character: string): boolean {
  const codePoint = character.codePointAt(0) ?? 0;

  return character.length === 1 && codePoint >= ARABIC_BLOCK_START && codePoint <= ARABIC_BLOCK_END;
}

function isClassified(character: string): boolean {
  return CONSONANTS.includes(character) || VOWELS.includes(character);
}

function isLiteraxx(name: LanguageName): boolean {
  return BASE_GAMES[name] === 'literaki' && name !== 'polishLiteraki';
}

function isTileCharacter(character: string, locale: Locale): boolean {
  const isLowercase = character === character.toLocaleLowerCase(locale);
  const isComposed = character === character.normalize('NFC');
  const isOneOrTwoLetters = /^\p{L}{1,2}$/u.test(character);

  return isLowercase && isComposed && isOneOrTwoLetters;
}
