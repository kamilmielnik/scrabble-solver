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

    it('lists the alphabet in tile order, with two-character tiles as one entry', () => {
      expect(config.alphabet).toEqual(['a', 'ch', 'ñ', 'll', 'rr']);
    });

    it('lists only the two-character tiles', () => {
      expect(config.twoCharacterTiles).toEqual(['ch', 'll', 'rr']);
    });

    it('lists no two-character tiles in a language without them', () => {
      expect(createConfig({ tiles: [{ character: 'a', score: 1 }] }).twoCharacterTiles).toEqual([]);
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

  describe('getTwoCharacterTileByPrefix', () => {
    it('finds the tile starting with the character', () => {
      expect(config.getTwoCharacterTileByPrefix('c')).toBe('ch');
      expect(config.getTwoCharacterTileByPrefix('l')).toBe('ll');
    });

    it('ignores the case of the prefix', () => {
      expect(config.getTwoCharacterTileByPrefix('C')).toBe('ch');
    });

    it('prefers the first listed tile when two share a prefix', () => {
      const shared = createConfig({
        tiles: [
          { character: 'cz', score: 1 },
          { character: 'ch', score: 1 },
        ],
      });

      expect(shared.getTwoCharacterTileByPrefix('c')).toBe('cz');
    });

    it('finds nothing for a character that starts no such tile', () => {
      expect(config.getTwoCharacterTileByPrefix('h')).toBeUndefined();
      expect(config.getTwoCharacterTileByPrefix('a')).toBeUndefined();
    });

    it('accepts only a single character', () => {
      expect(config.getTwoCharacterTileByPrefix('')).toBeUndefined();
      expect(config.getTwoCharacterTileByPrefix('ch')).toBeUndefined();
    });
  });

  describe('isTwoCharacterTilePrefix', () => {
    it('accepts the first character of a two-character tile, in either case', () => {
      expect(config.isTwoCharacterTilePrefix('c')).toBe(true);
      expect(config.isTwoCharacterTilePrefix('R')).toBe(true);
    });

    it('rejects anything else', () => {
      expect(config.isTwoCharacterTilePrefix('h')).toBe(false);
      expect(config.isTwoCharacterTilePrefix('ch')).toBe(false);
      expect(config.isTwoCharacterTilePrefix('')).toBe(false);
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
