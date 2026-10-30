/* eslint-disable max-lines */

import { BONUS_CHARACTER, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import { type Config, type ConfigJson, type TileConfig, Cell, Game, Locale, Tile } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import * as games from '../games';

import * as languages from './index';

type GameConfig = Omit<ConfigJson, 'locale' | 'tiles'>;
type GameName = keyof typeof games;
type LanguageName = keyof typeof languages;
type PublishedTiles = Record<number, string>;

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

const EXPECTED_LOCALES: Record<LanguageName, Locale> = {
  englishGbCrossplay: Locale.EN_GB,
  englishGbLetterLeague: Locale.EN_GB,
  englishGbLiteraki: Locale.EN_GB,
  englishGbScrabble: Locale.EN_GB,
  englishGbScrabbleDuel: Locale.EN_GB,
  englishGbSuperScrabble: Locale.EN_GB,
  englishGbWordfeud: Locale.EN_GB,
  englishUsCrossplay: Locale.EN_US,
  englishUsLetterLeague: Locale.EN_US,
  englishUsLiteraki: Locale.EN_US,
  englishUsScrabble: Locale.EN_US,
  englishUsScrabbleDuel: Locale.EN_US,
  englishUsSuperScrabble: Locale.EN_US,
  englishUsWordfeud: Locale.EN_US,
  frenchScrabble: Locale.FR_FR,
  germanScrabble: Locale.DE_DE,
  persianScrabble: Locale.FA_IR,
  polishLiteraki: Locale.PL_PL,
  polishScrabble: Locale.PL_PL,
  polishWyrazy: Locale.PL_PL,
  romanianScrabble: Locale.RO_RO,
  romanianSuperScrabble: Locale.RO_RO,
  spanishScrabble: Locale.ES_ES,
  turkishKelimelik: Locale.TR_TR,
  turkishScrabble: Locale.TR_TR,
};

const PUBLISHED_TILE_TOTALS: Partial<Record<LanguageName, number>> = {
  englishGbLiteraki: 100,
  englishGbScrabble: 100,
  englishGbScrabbleDuel: 100,
  englishGbSuperScrabble: 200,
  englishGbWordfeud: 104,
  englishUsLiteraki: 100,
  englishUsScrabble: 100,
  englishUsScrabbleDuel: 100,
  englishUsSuperScrabble: 200,
  englishUsWordfeud: 104,
  frenchScrabble: 102,
  germanScrabble: 102,
  persianScrabble: 102,
  polishLiteraki: 100,
  polishScrabble: 100,
  polishWyrazy: 100,
  romanianScrabble: 100,
  romanianSuperScrabble: 200,
  spanishScrabble: 100,
  turkishKelimelik: 100,
  turkishScrabble: 100,
};

const ENGLISH_SCRABBLE: PublishedTiles = {
  1: 'e12 a9 i9 o8 n6 r6 t6 l4 s4 u4',
  2: 'd4 g3',
  3: 'b2 c2 m2 p2',
  4: 'f2 h2 v2 w2 y2',
  5: 'k1',
  8: 'j1 x1',
  10: 'q1 z1',
};

const ENGLISH_SUPER_SCRABBLE: PublishedTiles = {
  1: 'e24 a16 o15 t15 i13 n13 r13 s10 l7 u7',
  2: 'd8 g5',
  3: 'c6 m6 b4 p4',
  4: 'h5 f4 w4 y4 v3',
  5: 'k2',
  8: 'j2 x2',
  10: 'q2 z2',
};

const ENGLISH_WORDFEUD: PublishedTiles = {
  1: 'e12 a10 i9 o7 t7 n6 r6 s5 l4',
  2: 'd5 u4',
  3: 'g3 m2',
  4: 'h3 b2 c2 f2 p2 v2 w2 y2',
  5: 'k1',
  8: 'x1',
  10: 'j1 q1 z1',
};

const ENGLISH_CROSSPLAY_SCORES: PublishedTiles = {
  1: 'a e i n o r s t',
  2: 'd l u',
  3: 'c h m p',
  4: 'b f g y',
  5: 'w',
  6: 'k v',
  8: 'x',
  10: 'j q z',
};

const ENGLISH_LETTER_LEAGUE_SCORES: PublishedTiles = {
  1: 'a e i n o r s t u',
  2: 'd g l',
  3: 'b c m p',
  4: 'f h v w y',
  5: 'k',
  8: 'j x',
  10: 'q z',
};

const FRENCH_SCRABBLE: PublishedTiles = {
  1: 'e15 a9 i8 n6 o6 r6 s6 t6 u6 l5',
  2: 'd3 m3 g2',
  3: 'b2 c2 p2',
  4: 'f2 h2 v2',
  8: 'j1 q1',
  10: 'k1 w1 x1 y1 z1',
};

const GERMAN_SCRABBLE: PublishedTiles = {
  1: 'e15 n9 s7 i6 r6 t6 u6 a5 d4',
  2: 'h4 g3 l3 o3',
  3: 'm4 b2 w1 z1',
  4: 'c2 f2 k2 p1',
  6: 'ä1 j1 ü1 v1',
  8: 'ö1 x1',
  10: 'q1 y1',
};

const POLISH_SCRABBLE: PublishedTiles = {
  1: 'a9 i8 e7 o6 n5 z5 r4 s4 w4',
  2: 'y4 c3 d3 k3 l3 m3 p3 t3',
  3: 'b2 g2 h2 j2 ł2 u2',
  5: 'ą1 ę1 f1 ó1 ś1 ż1',
  6: 'ć1',
  7: 'ń1',
  9: 'ź1',
};

const POLISH_LITERAKI: PublishedTiles = {
  1: 'a9 i8 e7 o6 n5 z5 r4 s4 w4',
  2: 'y4 c3 d3 k3 l3 m3 p3 t3',
  3: 'b2 g2 h2 j2 ł2 u2',
  5: 'ą1 ć1 ę1 f1 ń1 ó1 ś1 ź1 ż1',
};

const ROMANIAN_SCRABBLE: PublishedTiles = {
  1: 'a11 i10 e9 r7 t7 n6 u6 c5 o5 s5 l4',
  2: 'd4 p4',
  4: 'm3',
  8: 'f2 v2',
  9: 'b2 g2',
  10: 'h1 j1 x1 z1',
};

const SPANISH_SCRABBLE: PublishedTiles = {
  1: 'a12 e12 o9 i6 s6 n5 r5 u5 l4 t4',
  2: 'd5 g2',
  3: 'c4 b2 m2 p2',
  4: 'h2 f1 v1 y1',
  5: 'ch1 q1',
  8: 'j1 ll1 ñ1 rr1 x1',
  10: 'z1',
};

const TURKISH_SCRABBLE: PublishedTiles = {
  1: 'a12 e8 i7 k7 l7 r6 n5 t5',
  2: 'ı4 m4 o3 s3 u3',
  3: 'b2 d2 ü2 y2',
  4: 'c2 ç2 ş2 z2',
  5: 'g1 h1 p1',
  7: 'f1 ö1 v1',
  8: 'ğ1',
  10: 'j1',
};

const PUBLISHED_TILES: [LanguageName, PublishedTiles][] = [
  ['englishGbCrossplay', ENGLISH_CROSSPLAY_SCORES],
  ['englishGbLetterLeague', ENGLISH_LETTER_LEAGUE_SCORES],
  ['englishGbScrabble', ENGLISH_SCRABBLE],
  ['englishGbSuperScrabble', ENGLISH_SUPER_SCRABBLE],
  ['englishGbWordfeud', ENGLISH_WORDFEUD],
  ['englishUsCrossplay', ENGLISH_CROSSPLAY_SCORES],
  ['englishUsLetterLeague', ENGLISH_LETTER_LEAGUE_SCORES],
  ['englishUsScrabble', ENGLISH_SCRABBLE],
  ['englishUsSuperScrabble', ENGLISH_SUPER_SCRABBLE],
  ['englishUsWordfeud', ENGLISH_WORDFEUD],
  ['frenchScrabble', FRENCH_SCRABBLE],
  ['germanScrabble', GERMAN_SCRABBLE],
  ['polishLiteraki', POLISH_LITERAKI],
  ['polishScrabble', POLISH_SCRABBLE],
  ['romanianScrabble', ROMANIAN_SCRABBLE],
  ['spanishScrabble', SPANISH_SCRABBLE],
  ['turkishKelimelik', TURKISH_SCRABBLE],
  ['turkishScrabble', TURKISH_SCRABBLE],
];

const LOCALES_WITHOUT_LETTER_GROUPS = [Locale.FA_IR];

describe.each(LANGUAGES)('%s', (name, config) => {
  it('is its base game with only the locale and the tiles added', () => {
    const { locale, name: displayName, tiles, ...rest } = config.toJson();
    const { name: baseDisplayName, ...base } = GAMES[BASE_GAMES[name]];

    expect(rest).toEqual(base);
    expect(locale).toBe(EXPECTED_LOCALES[name]);
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

  it('gives every coloured Literaki field at least one tile that can match it', () => {
    const fieldScores = config.bonuses.flatMap(({ score }) => (score === undefined ? [] : [score]));
    const tileScores = config.tiles.map(({ score }) => score);

    expect(new Set(fieldScores).difference(new Set(tileScores))).toEqual(new Set());
  });
});

describe('tile totals', () => {
  it.each(Object.entries(PUBLISHED_TILE_TOTALS))('%s has the published number of tiles', (name, total) => {
    const config = CONFIGS[name as LanguageName];
    const lettersCount = config.tiles.reduce((sum, { count = 0 }) => sum + count, 0);

    expect(lettersCount + config.blanksCount).toBe(total);
  });

  it('checks every config that tracks tile counts', () => {
    const tracked = LANGUAGES.filter(([, config]) => config.supportsRemainingTiles).map(([name]) => name);

    expect(tracked.toSorted()).toEqual(Object.keys(PUBLISHED_TILE_TOTALS).toSorted());
  });
});

describe('published tiles', () => {
  it.each(PUBLISHED_TILES)('%s has the published letters, counts and scores', (name, published) => {
    const { supportsRemainingTiles, tiles } = CONFIGS[name];

    expect(sortTiles(tiles)).toEqual(sortTiles(parsePublishedTiles(published, supportsRemainingTiles)));
  });
});

describe('remaining tiles', () => {
  it.each(['englishGbCrossplay', 'englishUsCrossplay'] as const)('%s has no counts to track', (name) => {
    expect(CONFIGS[name].supportsRemainingTiles).toBe(false);
  });

  it.each(['englishGbLetterLeague', 'englishUsLetterLeague'] as const)(
    '%s has no counts to track, because its bag is randomised',
    (name) => {
      expect(CONFIGS[name].supportsRemainingTiles).toBe(false);
    },
  );
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

  it('has the 26 letters of the alphabet in every game', () => {
    const englishConfigs = LANGUAGES.filter(([, { locale }]) => [Locale.EN_GB, Locale.EN_US].includes(locale));

    for (const [, config] of englishConfigs) {
      expect(config.alphabet.toSorted().join('')).toBe('abcdefghijklmnopqrstuvwxyz');
    }
  });

  it('keeps the blank at zero points through the Config lookups', () => {
    expect(languages.englishUsScrabble.getTilePoints(new Tile({ character: 'q', isBlank: true }))).toBe(0);
    expect(languages.englishUsScrabble.getTilePoints(new Tile({ character: 'q' }))).toBe(10);
  });
});

describe('Spanish', () => {
  it('has the three digraphs as tiles of their own', () => {
    expect(languages.spanishScrabble.twoCharacterTiles).toEqual(['ch', 'll', 'rr']);
  });

  it('resolves a typed first letter to its digraph, regardless of case', () => {
    expect(languages.spanishScrabble.getTwoCharacterTileByPrefix('c')).toBe('ch');
    expect(languages.spanishScrabble.getTwoCharacterTileByPrefix('L')).toBe('ll');
    expect(languages.spanishScrabble.getTwoCharacterTileByPrefix('r')).toBe('rr');
    expect(languages.spanishScrabble.isTwoCharacterTilePrefix('a')).toBe(false);
  });

  it('keeps the single letters that the digraphs start with', () => {
    for (const character of ['c', 'h', 'l', 'r']) {
      expect(languages.spanishScrabble.hasCharacter(character)).toBe(true);
    }
  });

  it('has no k or w, as they are only used in words of foreign origin', () => {
    expect(languages.spanishScrabble.hasCharacter('k')).toBe(false);
    expect(languages.spanishScrabble.hasCharacter('w')).toBe(false);
  });

  it('is the only language with two-character tiles', () => {
    const withDigraphs = LANGUAGES.filter(([, config]) => config.twoCharacterTiles.length > 0).map(([name]) => name);

    expect(withDigraphs).toEqual(['spanishScrabble']);
  });
});

describe('Polish', () => {
  it('scores ć, ń and ź lower in Literaki than in Scrabble, and nothing else differently', () => {
    const differences = languages.polishScrabble.tiles.filter(({ character, score }) => {
      return languages.polishLiteraki.pointsMap[character] !== score;
    });

    expect(differences.map(({ character, score }) => [character, score])).toEqual([
      ['ć', 6],
      ['ń', 7],
      ['ź', 9],
    ]);
  });

  it('has no q, v or x', () => {
    for (const character of ['q', 'v', 'x']) {
      expect(languages.polishScrabble.hasCharacter(character)).toBe(false);
    }
  });

  it('applies a coloured Literaki field only to a tile of the same colour', () => {
    const { polishLiteraki } = languages;
    const centreBonus = polishLiteraki.bonuses.find(({ x, y }) => x === 7 && y === 7);

    expect(centreBonus?.type).toBe(BONUS_CHARACTER);
    expect(centreBonus?.canApply(polishLiteraki, getEmptyCell('ż', 7, 7))).toBe(true);
    expect(centreBonus?.canApply(polishLiteraki, getEmptyCell('a', 7, 7))).toBe(false);
  });
});

describe('Romanian', () => {
  it('has no k, q, w or y, and no letters with diacritics', () => {
    const alphabet = languages.romanianScrabble.alphabet.toSorted().join('');

    expect(alphabet).toBe('abcdefghijlmnoprstuvxz');
  });

  it('doubles the Scrabble bag for Super Scrabble and keeps the scores', () => {
    const doubled = languages.romanianScrabble.tiles.map(({ character, count = 0, score }) => {
      return { character, count: count * 2, score };
    });

    expect(languages.romanianSuperScrabble.tiles).toEqual(doubled);
  });
});

describe('Turkish', () => {
  it('has both dotted and dotless i, as separate tiles with their own scores', () => {
    expect(languages.turkishScrabble.pointsMap.i).toBe(1);
    expect(languages.turkishScrabble.pointsMap.ı).toBe(2);
  });

  it('has no q, w or x', () => {
    for (const character of ['q', 'w', 'x']) {
      expect(languages.turkishScrabble.hasCharacter(character)).toBe(false);
    }
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

  it.todo('has a tile for alef madda, or words such as آب in the word list can never be played');
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

  it.todo('classifies the Spanish digraphs ch, ll and rr as consonants in Result.consonantsCount');

  it.todo('classifies y as a consonant in Turkish, where the lists treat it as a vowel for every locale');
});

describe('Scrabble in every language', () => {
  it('reads a triple word corner through Config the same way everywhere', () => {
    const scrabbleConfigs = LANGUAGES.filter(([, { game }]) => game === Game.Scrabble);

    for (const [, config] of scrabbleConfigs) {
      expect(config.getCellBonusValue(new Cell({ x: 0, y: 0 }))).toEqual({ characterMultiplier: 1, wordMultiplier: 3 });
    }
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

function parsePublishedTiles(published: PublishedTiles, hasCounts: boolean): TileConfig[] {
  return Object.entries(published).flatMap(([score, tiles]) => {
    return tiles.split(' ').map((tile) => {
      const [, character, count] = tile.match(/^(\D+)(\d*)$/) as RegExpMatchArray;
      const tileScore = { character, score: Number(score) };

      return hasCounts ? { ...tileScore, count: Number(count) } : tileScore;
    });
  });
}

function sortTiles(tiles: TileConfig[]): TileConfig[] {
  return tiles.toSorted((a, b) => a.character.localeCompare(b.character, 'und', { sensitivity: 'variant' }));
}
