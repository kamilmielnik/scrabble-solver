/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Board, Cell, Game, Locale, Tile } from '@scrabble-solver/types';

import { getRemainingTiles } from './lib';

const config = getConfig(Game.Scrabble, Locale.EN_US);

describe('getRemainingTiles', () => {
  it('reports nothing used on an empty board and rack', () => {
    const tiles = getRemainingTiles(config, Board.create(15, 15), [], 'en-US');

    expect(tiles.every((tile) => tile.usedCount === 0)).toBe(true);
    expect(tiles).toHaveLength(config.tiles.length + 1);
  });

  it('counts letters on the board and on the rack', () => {
    const board = Board.fromStringArray(['aa ']);
    const tiles = getRemainingTiles(config, board, ['a'], 'en-US');

    expect(tiles.find((tile) => tile.character === 'a')?.usedCount).toBe(3);
  });

  it('counts a blank on the board as a blank, not as the letter it plays', () => {
    const board = Board.create(1, 1);
    board.updateCell(
      0,
      0,
      () => new Cell({ isEmpty: false, tile: new Tile({ character: 'a', isBlank: true }), x: 0, y: 0 }),
    );
    const tiles = getRemainingTiles(config, board, [BLANK], 'en-US');

    expect(tiles.find((tile) => tile.character === 'a')?.usedCount).toBe(0);
    expect(tiles.at(-1)).toEqual({
      character: BLANK,
      count: config.blanksCount,
      score: config.blankScore,
      usedCount: 2,
    });
  });

  it('adds letters outside the alphabet with no count or score, counting each use', () => {
    const tiles = getRemainingTiles(config, Board.create(1, 1), ['ą', 'ą'], 'en-US');

    expect(tiles.find((tile) => tile.character === 'ą')).toEqual({ character: 'ą', count: 0, score: 0, usedCount: 2 });
  });

  it('sorts letters by locale and puts the blank last', () => {
    const polish = getConfig(Game.Scrabble, Locale.PL_PL);
    const tiles = getRemainingTiles(polish, Board.create(1, 1), [], 'pl-PL');
    const characters = tiles.map((tile) => tile.character);

    expect(characters.indexOf('ą')).toBe(characters.indexOf('a') + 1);
    expect(characters.at(-1)).toBe(BLANK);
  });
});
