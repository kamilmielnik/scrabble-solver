import { BONUS_WORD } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Bonus } from './Bonus';
import { Cell } from './Cell';
import { Config } from './Config';
import { Game } from './Game';
import { Locale } from './Locale';
import { Tile } from './Tile';
import { WordBonus } from './WordBonus';

describe('WordBonus', () => {
  it('is a bonus of the word type', () => {
    const bonus = new WordBonus({ multiplier: 2, x: 0, y: 0 });

    expect(bonus).toBeInstanceOf(Bonus);
    expect(bonus.type).toBe(BONUS_WORD);
  });

  it('multiplies the word and leaves the character alone', () => {
    expect(new WordBonus({ multiplier: 3, x: 0, y: 0 }).value).toEqual({ characterMultiplier: 1, wordMultiplier: 3 });
  });

  it('serializes with its type', () => {
    expect(new WordBonus({ multiplier: 3, x: 1, y: 2 }).toJson()).toStrictEqual({
      multiplier: 3,
      score: undefined,
      type: BONUS_WORD,
      x: 1,
      y: 2,
    });
  });

  it('applies whatever the tile is worth, unlike a character bonus', () => {
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
    const bonus = new WordBonus({ multiplier: 2, score: 99, x: 1, y: 1 });

    expect(bonus.canApply(config, new Cell({ tile: new Tile({ character: 'a' }), x: 1, y: 1 }))).toBe(true);
  });
});
