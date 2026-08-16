import { Board, Cell, Result, Tile } from '@scrabble-solver/types';

import { getReachableCellsFromResults } from './lib';

describe('getReachableCellsFromResults', () => {
  const board = Board.fromStringArray(['     ', '     ', '  i  ', '     ', '     ']);

  it('marks only cells with tiles as reachable when there are no results', () => {
    expect(getReachableCellsFromResults(board, [])).toEqual([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
  });

  it('marks cells covered by any result as reachable and all other empty cells as unreachable', () => {
    const results = [
      createResult([createPlacedCell('q', 1, 2), board.rows[2][2]]),
      createResult([createPlacedCell('q', 2, 1), board.rows[2][2]]),
    ];

    expect(getReachableCellsFromResults(board, results)).toEqual([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
  });
});

function createResult(cells: Cell[]): Result {
  return new Result({ cells, collisions: [], id: 0, points: 0 });
}

function createPlacedCell(character: string, x: number, y: number): Cell {
  return new Cell({ isEmpty: true, tile: new Tile({ character }), x, y });
}
