/* eslint-disable max-lines */
import { BLANK, BONUS_CHARACTER, BONUS_WORD, NO_BONUS } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Cell } from './Cell';
import { CharacterBonus } from './CharacterBonus';
import { Config } from './Config';
import { type ConfigJson } from './ConfigJson';
import { Game } from './Game';
import { Locale } from './Locale';
import { Tile } from './Tile';
import { WordBonus } from './WordBonus';

const CONFIG_JSON: ConfigJson = {
  bingo: { score: 50 },
  blankScore: 2,
  blanksCount: 3,
  boardHeight: 11,
  boardWidth: 15,
  bonuses: [
    { multiplier: 2, type: BONUS_CHARACTER, x: 1, y: 2 },
    { multiplier: 3, score: 5, type: BONUS_CHARACTER, x: 3, y: 4 },
    { multiplier: 4, type: BONUS_WORD, x: 5, y: 6 },
  ],
  game: Game.Literaki,
  locale: Locale.ES_ES,
  name: 'Test',
  rackSize: 8,
  tiles: [
    { character: 'a', count: 9, score: 1 },
    { character: 'ch', count: 1, score: 5 },
    { character: 'ñ', count: 1, score: 8 },
    { character: 'll', count: 1, score: 7 },
    { character: 'rr', count: 0, score: 8 },
  ],
};

describe('Config', () => {
  const config = new Config(CONFIG_JSON);

  describe('fromJson and toJson', () => {
    it('hands back the source object', () => {
      expect(Config.fromJson(CONFIG_JSON).toJson()).toBe(CONFIG_JSON);
    });

    it('exposes the source object', () => {
      expect(config.config).toBe(CONFIG_JSON);
    });

    it('builds a real instance', () => {
      expect(Config.fromJson(CONFIG_JSON)).toBeInstanceOf(Config);
    });

    it('rebuilds an equal config from serialized text', () => {
      const decoded = Config.fromJson(JSON.parse(JSON.stringify(config.toJson())) as ConfigJson);

      expect(decoded.toJson()).toStrictEqual(CONFIG_JSON);
      expect(decoded.pointsMap).toEqual(config.pointsMap);
    });
  });

  describe('getters', () => {
    it('reads each value from the source object', () => {
      expect(config.bingo).toBe(CONFIG_JSON.bingo);
      expect(config.blankScore).toBe(2);
      expect(config.blanksCount).toBe(3);
      expect(config.boardHeight).toBe(11);
      expect(config.boardWidth).toBe(15);
      expect(config.game).toBe(Game.Literaki);
      expect(config.locale).toBe(Locale.ES_ES);
      expect(config.rackSize).toBe(8);
      expect(config.tiles).toBe(CONFIG_JSON.tiles);
    });

    it('lists the alphabet in tile order, with digraphs as one entry', () => {
      expect(config.alphabet).toEqual(['a', 'ch', 'ñ', 'll', 'rr']);
    });

    it('lists only the digraphs', () => {
      expect(config.digraphs).toEqual(['ch', 'll', 'rr']);
    });

    it('lists digraphs of any length', () => {
      expect(createCatalanConfig().digraphs).toEqual(['l·l', 'ny', 'qu']);
    });

    it('lists no digraphs in a language without them', () => {
      expect(createConfig({ tiles: [{ character: 'a', score: 1 }] }).digraphs).toEqual([]);
    });

    it('maps each character to its score', () => {
      expect(config.pointsMap).toEqual({ a: 1, ch: 5, ll: 7, rr: 8, ñ: 8 });
    });

    it('takes the last score when a character is listed twice', () => {
      const duplicated = createConfig({
        tiles: [
          { character: 'a', score: 1 },
          { character: 'a', score: 9 },
        ],
      });

      expect(duplicated.pointsMap).toEqual({ a: 9 });
    });
  });

  describe('bonuses', () => {
    it('builds the bonus class matching each type, in order', () => {
      expect(config.bonuses.map((bonus) => bonus.constructor)).toEqual([CharacterBonus, CharacterBonus, WordBonus]);
    });

    it('carries each bonus field across', () => {
      expect(config.bonuses[1].toJson()).toStrictEqual({
        multiplier: 3,
        score: 5,
        type: BONUS_CHARACTER,
        x: 3,
        y: 4,
      });
    });

    it('allows a game without bonuses', () => {
      expect(createConfig({ bonuses: [] }).bonuses).toEqual([]);
    });

    it('refuses an unknown type and names it', () => {
      const bonuses = [{ multiplier: 2, type: 'BONUS_TILE', x: 0, y: 0 }];

      expect(() => new Config({ ...CONFIG_JSON, bonuses })).toThrow('Unsupported Bonus type: "BONUS_TILE"');
    });

    it('refuses an unknown type at the end of a valid list', () => {
      const bonuses = [...CONFIG_JSON.bonuses, { multiplier: 2, type: '', x: 0, y: 0 }];

      expect(() => Config.fromJson({ ...CONFIG_JSON, bonuses })).toThrow('Unsupported Bonus type: ""');
    });
  });

  describe('getCellBonus', () => {
    it('finds the bonus at the coordinates of the cell', () => {
      expect(config.getCellBonus(new Cell({ x: 5, y: 6 }))).toBe(config.bonuses[2]);
    });

    it('finds a bonus under a tile too', () => {
      const cell = new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 1, y: 2 });

      expect(config.getCellBonus(cell)).toBe(config.bonuses[0]);
    });

    it('finds nothing at other coordinates', () => {
      expect(config.getCellBonus(new Cell({ x: 2, y: 1 }))).toBeUndefined();
    });

    it('prefers the first bonus when two share a cell', () => {
      const stacked = createConfig({
        bonuses: [
          { multiplier: 2, type: BONUS_WORD, x: 0, y: 0 },
          { multiplier: 3, type: BONUS_CHARACTER, x: 0, y: 0 },
        ],
      });

      expect(stacked.getCellBonus(new Cell({ x: 0, y: 0 }))?.multiplier).toBe(2);
    });
  });

  describe('getCellBonusValue', () => {
    it('reads a character bonus', () => {
      expect(config.getCellBonusValue(new Cell({ x: 1, y: 2 }))).toEqual({ characterMultiplier: 2, wordMultiplier: 1 });
    });

    it('reads a word bonus', () => {
      expect(config.getCellBonusValue(new Cell({ x: 5, y: 6 }))).toEqual({ characterMultiplier: 1, wordMultiplier: 4 });
    });

    it('falls back to no bonus', () => {
      expect(config.getCellBonusValue(new Cell({ x: 0, y: 0 }))).toBe(NO_BONUS);
    });
  });

  describe('getCharacterPoints', () => {
    it('has no points for a missing character', () => {
      expect(config.getCharacterPoints(null)).toBeUndefined();
    });

    it('scores a blank with the blank score', () => {
      expect(config.getCharacterPoints(BLANK)).toBe(2);
    });

    it('scores a known character', () => {
      expect(config.getCharacterPoints('ñ')).toBe(8);
    });

    it('scores a two-character tile', () => {
      expect(config.getCharacterPoints('ch')).toBe(5);
    });

    it('has no points for an unknown character', () => {
      expect(config.getCharacterPoints('q')).toBeUndefined();
    });

    it('has no points for another case, since tiles are stored in lower case', () => {
      expect(config.getCharacterPoints('A')).toBeUndefined();
    });

    it('has no points for the name of an Object.prototype member such as "constructor"', () => {
      expect(config.getCharacterPoints('constructor')).toBeUndefined();
    });
  });

  describe('getTilePoints', () => {
    it('has no points for a missing tile', () => {
      expect(config.getTilePoints(null)).toBeUndefined();
    });

    it('scores a regular tile by its character', () => {
      expect(config.getTilePoints(new Tile({ character: 'll' }))).toBe(7);
    });

    it('scores a blank standing for a letter with the blank score', () => {
      expect(config.getTilePoints(new Tile({ character: 'll', isBlank: true }))).toBe(2);
    });

    it('scores a blank on the rack with the blank score', () => {
      expect(config.getTilePoints(new Tile({ character: BLANK, isBlank: true }))).toBe(2);
    });

    it('has no points for a tile outside the alphabet', () => {
      expect(config.getTilePoints(new Tile({ character: 'q' }))).toBeUndefined();
    });
  });

  describe('getDigraphByShortcut', () => {
    it('finds the digraph by its first letter', () => {
      expect(config.getDigraphByShortcut('c')).toBe('ch');
      expect(config.getDigraphByShortcut('l')).toBe('ll');
    });

    it('ignores the case of the key', () => {
      expect(config.getDigraphByShortcut('C')).toBe('ch');
    });

    it('ignores the case of the key using the casing rules of the locale', () => {
      const turkish = createConfig({
        locale: Locale.TR_TR,
        tiles: [{ character: 'ış', count: 1, score: 1 }],
      });

      expect(turkish.getDigraphByShortcut('I')).toBe('ış');
    });

    it('prefers the first listed digraph when two share a shortcut', () => {
      const shared = createConfig({
        tiles: [
          { character: 'cz', score: 1 },
          { character: 'ch', score: 1 },
        ],
      });

      expect(shared.getDigraphByShortcut('c')).toBe('cz');
    });

    it.each(['n', 'q', 't', 'w'])('skips %s, which browsers keep for themselves', (key) => {
      const reserved = createConfig({ tiles: [{ character: `${key}y`, score: 1 }] });

      expect(reserved.getDigraphByShortcut(key)).toBeUndefined();
      expect(reserved.getDigraphByShortcut('y')).toBe(`${key}y`);
    });

    it('skips characters that are not letters', () => {
      const dotted = createConfig({ tiles: [{ character: 't·l', score: 1 }] });

      expect(dotted.getDigraphByShortcut('·')).toBeUndefined();
      expect(dotted.getDigraphByShortcut('l')).toBe('t·l');
    });

    it('falls back to the first letter when every letter is reserved', () => {
      const reserved = createConfig({ tiles: [{ character: 'nt', score: 1 }] });

      expect(reserved.getDigraphByShortcut('n')).toBe('nt');
    });

    it('finds nothing for a key that is no shortcut', () => {
      expect(config.getDigraphByShortcut('h')).toBeUndefined();
      expect(config.getDigraphByShortcut('a')).toBeUndefined();
    });

    it('accepts only a single character', () => {
      expect(config.getDigraphByShortcut('')).toBeUndefined();
      expect(config.getDigraphByShortcut('ch')).toBeUndefined();
    });
  });

  describe('getDigraphShortcut', () => {
    it('is the first letter that browsers leave to the page', () => {
      const catalan = createCatalanConfig();

      expect(catalan.digraphs.map((digraph) => catalan.getDigraphShortcut(digraph))).toEqual(['l', 'y', 'u']);
    });
  });

  describe('longestDigraphLength', () => {
    it('is the length of the longest digraph', () => {
      expect(config.longestDigraphLength).toBe(2);
      expect(createCatalanConfig().longestDigraphLength).toBe(3);
    });

    it('is zero in a language without digraphs', () => {
      expect(createConfig({ tiles: [{ character: 'a', score: 1 }] }).longestDigraphLength).toBe(0);
    });
  });

  describe('isDigraphShortcut', () => {
    it('accepts the shortcut of a digraph, in either case', () => {
      expect(config.isDigraphShortcut('c')).toBe(true);
      expect(config.isDigraphShortcut('R')).toBe(true);
    });

    it('rejects anything else', () => {
      expect(config.isDigraphShortcut('h')).toBe(false);
      expect(config.isDigraphShortcut('ch')).toBe(false);
      expect(config.isDigraphShortcut('')).toBe(false);
    });
  });

  describe('isDigraphPart', () => {
    it('accepts every character of a digraph, tile or not', () => {
      const catalan = createCatalanConfig();

      expect(['l', '·', 'n', 'y', 'q', 'u'].filter((character) => catalan.isDigraphPart(character))).toHaveLength(6);
    });

    it('rejects a character outside every digraph', () => {
      expect(createCatalanConfig().isDigraphPart('a')).toBe(false);
    });
  });

  describe('isDigraphPrefix', () => {
    it('accepts the beginning of a digraph', () => {
      const catalan = createCatalanConfig();

      expect(catalan.isDigraphPrefix('l')).toBe(true);
      expect(catalan.isDigraphPrefix('l·')).toBe(true);
      expect(catalan.isDigraphPrefix('q')).toBe(true);
    });

    it('rejects a whole digraph, which has nothing left to continue', () => {
      expect(createCatalanConfig().isDigraphPrefix('l·l')).toBe(false);
    });

    it('rejects the end of a digraph', () => {
      const catalan = createCatalanConfig();

      expect(catalan.isDigraphPrefix('·')).toBe(false);
      expect(catalan.isDigraphPrefix('y')).toBe(false);
    });
  });

  describe('spellsDigraph', () => {
    it('finds neighboring characters that spell a digraph', () => {
      expect(config.spellsDigraph(['a', 'c', 'h'])).toBe(true);
      expect(createCatalanConfig().spellsDigraph(['l', '·', 'l', 'a'])).toBe(true);
    });

    it('finds nothing in characters that spell no digraph', () => {
      expect(config.spellsDigraph(['c', 'a', 'h'])).toBe(false);
      expect(config.spellsDigraph(['ch', 'a'])).toBe(false);
      expect(config.spellsDigraph([])).toBe(false);
    });

    it('finds a digraph spelled by a digraph and a character', () => {
      const klingon = createConfig({
        tiles: ['t', 'l', 'h', 'tl', 'tlh'].map((character) => ({ character, score: 1 })),
      });

      expect(klingon.spellsDigraph(['tl', 'h'])).toBe(true);
    });
  });

  describe('hasCharacter', () => {
    it('finds characters of the alphabet', () => {
      expect(config.hasCharacter('a')).toBe(true);
      expect(config.hasCharacter('ñ')).toBe(true);
      expect(config.hasCharacter('rr')).toBe(true);
    });

    it('finds a character worth nothing', () => {
      expect(createConfig({ tiles: [{ character: 'a', score: 0 }] }).hasCharacter('a')).toBe(true);
    });

    it('rejects characters outside the alphabet', () => {
      expect(config.hasCharacter('q')).toBe(false);
      expect(config.hasCharacter('A')).toBe(false);
      expect(config.hasCharacter('')).toBe(false);
    });

    it('does not count a blank as a character', () => {
      expect(config.hasCharacter(BLANK)).toBe(false);
    });

    it('does not read part of a two-character tile as a character', () => {
      expect(config.hasCharacter('c')).toBe(false);
    });

    it('rejects the name of an Object.prototype member such as "constructor"', () => {
      expect(config.hasCharacter('constructor')).toBe(false);
    });
  });

  describe('supportsRemainingTiles', () => {
    it('holds when every tile has a count, even a count of zero', () => {
      expect(config.supportsRemainingTiles).toBe(true);
    });

    it('fails when one tile has no count', () => {
      const tiles = [
        { character: 'a', count: 1, score: 1 },
        { character: 'b', score: 1 },
      ];

      expect(createConfig({ tiles }).supportsRemainingTiles).toBe(false);
    });

    it('fails when no tile has a count', () => {
      expect(createConfig({ tiles: [{ character: 'a', score: 1 }] }).supportsRemainingTiles).toBe(false);
    });
  });
});

function createConfig(overrides: Partial<ConfigJson>): Config {
  return new Config({ ...CONFIG_JSON, ...overrides });
}

function createCatalanConfig(): Config {
  return createConfig({
    locale: Locale.CA_ES,
    tiles: [
      { character: 'a', score: 1 },
      { character: 'l', score: 1 },
      { character: 'l·l', score: 10 },
      { character: 'n', score: 1 },
      { character: 'ny', score: 10 },
      { character: 'qu', score: 8 },
      { character: 'u', score: 1 },
    ],
  });
}
