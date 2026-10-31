import { BONUS_WORD } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Bonus } from './Bonus';
import { Cell } from './Cell';
import { Config } from './Config';
import { Game } from './Game';
import { Locale } from './Locale';
import { Tile } from './Tile';

class PlainBonus extends Bonus {
  public readonly type = BONUS_WORD;
}

describe('Bonus', () => {
  const config = new Config({
    bingo: { score: 50 },
    blankScore: 0,
    blanksCount: 2,
    boardHeight: 3,
    boardWidth: 3,
    bonuses: [],
    game: Game.Scrabble,
    locale: Locale.EN_US,
    name: 'Test',
    rackSize: 7,
    tiles: [{ character: 'a', count: 1, score: 1 }],
  });

  it('multiplies nothing on its own', () => {
    expect(new PlainBonus({ multiplier: 3, x: 0, y: 0 }).value).toEqual({ characterMultiplier: 1, wordMultiplier: 1 });
  });

  it('keeps its constructor fields', () => {
    const bonus = new PlainBonus({ multiplier: 3, score: 5, x: 1, y: 2 });

    expect(bonus.multiplier).toBe(3);
    expect(bonus.score).toBe(5);
    expect(bonus.x).toBe(1);
    expect(bonus.y).toBe(2);
  });

  describe('matchesCellCoordinates', () => {
    const bonus = new PlainBonus({ multiplier: 2, x: 1, y: 2 });

    it('matches a cell at the same coordinates', () => {
      expect(bonus.matchesCellCoordinates(new Cell({ x: 1, y: 2 }))).toBe(true);
    });

    it('rejects a cell in another column', () => {
      expect(bonus.matchesCellCoordinates(new Cell({ x: 2, y: 2 }))).toBe(false);
    });

    it('rejects a cell in another row', () => {
      expect(bonus.matchesCellCoordinates(new Cell({ x: 1, y: 1 }))).toBe(false);
    });

    it('does not read the coordinates swapped', () => {
      expect(bonus.matchesCellCoordinates(new Cell({ x: 2, y: 1 }))).toBe(false);
    });
  });

  describe('canApply', () => {
    const bonus = new PlainBonus({ multiplier: 2, x: 1, y: 1 });

    it('applies to an empty cell at its coordinates', () => {
      expect(bonus.canApply(config, new Cell({ x: 1, y: 1 }))).toBe(true);
    });

    it('applies to a tile being placed there', () => {
      expect(bonus.canApply(config, new Cell({ tile: new Tile({ character: 'a' }), x: 1, y: 1 }))).toBe(true);
    });

    it('is used up once a tile sits on the board', () => {
      const cell = new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 1, y: 1 });

      expect(bonus.canApply(config, cell)).toBe(false);
    });

    it('does not apply elsewhere', () => {
      expect(bonus.canApply(config, new Cell({ x: 0, y: 1 }))).toBe(false);
    });
  });

  describe('toJson', () => {
    it('writes every field', () => {
      expect(new PlainBonus({ multiplier: 2, score: 5, x: 1, y: 2 }).toJson()).toStrictEqual({
        multiplier: 2,
        score: 5,
        type: BONUS_WORD,
        x: 1,
        y: 2,
      });
    });

    it('omits an unset score once serialized to text', () => {
      const json = new PlainBonus({ multiplier: 2, x: 1, y: 2 }).toJson();

      expect(JSON.parse(JSON.stringify(json))).toStrictEqual({ multiplier: 2, type: BONUS_WORD, x: 1, y: 2 });
    });
  });
});
