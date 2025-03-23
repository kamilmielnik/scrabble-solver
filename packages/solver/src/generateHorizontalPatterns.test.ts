import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Config } from '@scrabble-solver/types';

import generateHorizontalPatterns from './generateHorizontalPatterns';

const board = Board.fromStringArray([' t ', 'do ', '   ']);

const config = {
  boardHeight: 3,
  boardWidth: 3,
  rackSize: 7,
} as Config;

describe('generateHorizontalPatterns', () => {
  it('generates some horizontal patterns', () => {
    expect(generateHorizontalPatterns(config, board).length).toBeGreaterThan(0);
  });

  it('generates proper horizontal patterns', () => {
    const horizontal = generateHorizontalPatterns(config, board);
    expect(horizontal.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 't'],
      [EMPTY_CELL, 't', EMPTY_CELL],
      ['t', EMPTY_CELL],
      ['d', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ]);
  });
});
