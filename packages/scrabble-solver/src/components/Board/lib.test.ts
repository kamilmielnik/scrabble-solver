import { Board, Cell, Result, Tile } from '@scrabble-solver/types';

import { getReachableCellsFromResults, getWordCells } from './lib';

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

describe('getWordCells', () => {
  const board = Board.fromStringArray(['     ', ' cat ', ' o   ', ' d  x', '     ']);

  it('marks the cells of a horizontal word', () => {
    expect(getWordCells(board, { direction: 'horizontal', word: 'cat', x: 1, y: 1 })).toEqual([
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
  });

  it('marks the cells of a vertical word', () => {
    expect(getWordCells(board, { direction: 'vertical', word: 'cod', x: 1, y: 1 })).toEqual([
      [false, false, false, false, false],
      [false, true, false, false, false],
      [false, true, false, false, false],
      [false, true, false, false, false],
      [false, false, false, false, false],
    ]);
  });

  it('stops at the board edge', () => {
    expect(getWordCells(board, { direction: 'horizontal', word: 'x', x: 4, y: 3 })).toEqual([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, true],
      [false, false, false, false, false],
    ]);
  });

  it('marks the run of cells regardless of the word length in characters', () => {
    const digraphBoard = new Board({
      rows: [
        [createFilledCell('ch', 0, 0), createFilledCell('e', 1, 0), createEmptyCell(2, 0)],
        [createEmptyCell(0, 1), createEmptyCell(1, 1), createEmptyCell(2, 1)],
      ],
    });

    expect(getWordCells(digraphBoard, { direction: 'horizontal', word: 'che', x: 0, y: 0 })).toEqual([
      [true, true, false],
      [false, false, false],
    ]);
  });

  it('marks nothing when the starting cell is empty', () => {
    expect(getWordCells(board, { direction: 'horizontal', word: 'gone', x: 0, y: 4 })).toEqual([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
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

function createFilledCell(character: string, x: number, y: number): Cell {
  return new Cell({ isEmpty: false, tile: new Tile({ character }), x, y });
}

function createEmptyCell(x: number, y: number): Cell {
  return new Cell({ isEmpty: true, tile: Tile.Null, x, y });
}
