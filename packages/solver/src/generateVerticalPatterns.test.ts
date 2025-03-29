import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, type Config } from '@scrabble-solver/types';

import { generateVerticalPatterns } from './generateVerticalPatterns';

const board = Board.fromStringArray([' t ', 'do ', '   ']);

const config = {
  boardHeight: 3,
  boardWidth: 3,
  rackSize: 7,
} as Config;

describe('generateVerticalPatterns', () => {
  it('generates some vertical patterns', () => {
    expect(generateVerticalPatterns(config, board).length).toBeGreaterThan(0);
  });

  it('generates proper vertical patterns', () => {
    const vertical = generateVerticalPatterns(config, board);

    expect(vertical.map(({ cells }) => cells.map(String))).toEqual([
      [EMPTY_CELL, 'd'],
      [EMPTY_CELL, 'd', EMPTY_CELL],
      ['d', EMPTY_CELL],
      ['t', 'o', EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ]);
  });
});
