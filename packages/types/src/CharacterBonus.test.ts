import { BONUS_CHARACTER } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Bonus } from './Bonus';
import { Cell } from './Cell';
import { CharacterBonus } from './CharacterBonus';
import { Config } from './Config';
import { Game } from './Game';
import { Locale } from './Locale';
import { Tile } from './Tile';

describe('CharacterBonus', () => {
  const config = new Config({
    bingo: { score: 50 },
    blankScore: 0,
    blanksCount: 2,
    boardHeight: 3,
    boardWidth: 3,
    bonuses: [],
    game: Game.Literaki,
    locale: Locale.PL_PL,
    name: 'Test',
    rackSize: 7,
    tiles: [
      { character: 'a', count: 1, score: 1 },
      { character: 'b', count: 1, score: 2 },
    ],
  });

  it('is a bonus of the character type', () => {
    const bonus = new CharacterBonus({ multiplier: 2, x: 0, y: 0 });

    expect(bonus).toBeInstanceOf(Bonus);
    expect(bonus.type).toBe(BONUS_CHARACTER);
  });

  it('multiplies the character and leaves the word alone', () => {
    expect(new CharacterBonus({ multiplier: 3, x: 0, y: 0 }).value).toEqual({
      characterMultiplier: 3,
      wordMultiplier: 1,
    });
  });

  it('serializes with its type', () => {
    expect(new CharacterBonus({ multiplier: 3, score: 2, x: 1, y: 2 }).toJson()).toStrictEqual({
      multiplier: 3,
      score: 2,
      type: BONUS_CHARACTER,
      x: 1,
      y: 2,
    });
  });

  describe('without a required score', () => {
    const bonus = new CharacterBonus({ multiplier: 2, x: 1, y: 1 });

    it('applies to any tile', () => {
      expect(bonus.canApply(config, placedCell('a'))).toBe(true);
      expect(bonus.canApply(config, placedCell('b'))).toBe(true);
    });

    it('matches any score', () => {
      expect(bonus.matchesCellTileScore(config, placedCell('unknown'))).toBe(true);
    });
  });

  describe('with a required score', () => {
    const bonus = new CharacterBonus({ multiplier: 2, score: 2, x: 1, y: 1 });

    it('applies to a tile worth that score', () => {
      expect(bonus.canApply(config, placedCell('b'))).toBe(true);
    });

    it('does not apply to a tile worth another score', () => {
      expect(bonus.canApply(config, placedCell('a'))).toBe(false);
    });

    it('does not apply to a character missing from the config', () => {
      expect(bonus.canApply(config, placedCell('z'))).toBe(false);
    });

    it('judges a blank by the letter it stands for, as the solver does', () => {
      expect(bonus.canApply(config, placedCell('b', true))).toBe(true);
      expect(bonus.canApply(config, placedCell('a', true))).toBe(false);
    });

    it('does not apply to an empty cell', () => {
      expect(bonus.canApply(config, new Cell({ x: 1, y: 1 }))).toBe(false);
    });
  });

  it('still requires the base rules when the score matches', () => {
    const bonus = new CharacterBonus({ multiplier: 2, score: 2, x: 1, y: 1 });
    const occupied = new Cell({ isEmpty: false, tile: new Tile({ character: 'b' }), x: 1, y: 1 });
    const elsewhere = new Cell({ tile: new Tile({ character: 'b' }), x: 0, y: 0 });

    expect(bonus.canApply(config, occupied)).toBe(false);
    expect(bonus.canApply(config, elsewhere)).toBe(false);
  });
});

function placedCell(character: string, isBlank = false): Cell {
  return new Cell({ tile: new Tile({ character, isBlank }), x: 1, y: 1 });
}
