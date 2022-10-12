import { Board, Cell, Pattern, Tile } from '@scrabble-solver/types';

import getPatternHash from './getPatternHash';

describe('getPatternHash', () => {
  const board = Board.fromStringArray([' t ', 'do ', '   ']);

  it('hashes blanks', () => {
    const pattern = new Pattern({
      board,
      cells: [
        new Cell({ x: 0, y: 0, tile: new Tile({ character: 'a', isBlank: false }) }),
        new Cell({ x: 0, y: 1, tile: new Tile({ character: 'b', isBlank: true }) }),
        new Cell({ x: 0, y: 2, tile: new Tile({ character: 'c', isBlank: false }) }),
      ],
    });

    expect(getPatternHash(pattern)).toBe('0,0,a-0,1,b!-0,2,c');
  });
});
