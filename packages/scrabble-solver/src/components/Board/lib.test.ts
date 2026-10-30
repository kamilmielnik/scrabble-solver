/* eslint-disable max-lines */

import { languages } from '@scrabble-solver/configs';
import { type Bonus, Board, Cell, Config, Locale, Result, Tile } from '@scrabble-solver/types';

import { COLOR_BONUS_CHARACTER, COLOR_BONUS_CHARACTER_MULTIPLIER, COLOR_BONUS_WORD } from '../../parameters';

import {
  createGrid,
  getBonusColor,
  getPositionInGrid,
  getReachableCells,
  getReachableCellsFromResults,
  getWordCells,
} from './lib';

describe('createGrid', () => {
  it('builds height rows of width cells from their coordinates', () => {
    expect(createGrid(2, 3, (x, y) => `${x}${y}`)).toEqual([
      ['00', '10'],
      ['01', '11'],
      ['02', '12'],
    ]);
  });
});

describe('getPositionInGrid', () => {
  const grid = [
    ['a', 'b'],
    ['c', 'b'],
  ];

  it('finds the first match in reading order', () => {
    expect(getPositionInGrid(grid, (value) => value === 'b')).toEqual({ x: 1, y: 0 });
  });

  it('is undefined without a match', () => {
    expect(getPositionInGrid(grid, (value) => value === 'z')).toBeUndefined();
  });
});

describe('getBonusColor', () => {
  it('colours word bonuses by multiplier', () => {
    expect(getBonusColor(createBonus({ multiplier: 3, type: 'BONUS_WORD' }))).toBe(COLOR_BONUS_WORD[3]);
  });

  it('colours scored character bonuses by score', () => {
    expect(getBonusColor(createBonus({ score: 5, type: 'BONUS_CHARACTER' }))).toBe(COLOR_BONUS_CHARACTER[5]);
  });

  it('colours plain character bonuses by multiplier', () => {
    expect(getBonusColor(createBonus({ multiplier: 2, type: 'BONUS_CHARACTER' }))).toBe(
      COLOR_BONUS_CHARACTER_MULTIPLIER[2],
    );
  });

  it('has a colour for every bonus of every shipped board', () => {
    for (const config of Object.values(languages)) {
      for (const bonus of new Config(config.config).bonuses) {
        expect(getBonusColor(bonus)).toStartWith('#');
      }
    }
  });
});

describe('getReachableCells', () => {
  const emptyBoard = Board.create(5, 5);
  const centerTile = Board.fromStringArray(['     ', '     ', '  a  ', '     ', '     ']);

  it('reaches nothing with no tiles to play', () => {
    expect(getReachableCells(centerTile, 0).flat().some(Boolean)).toBe(false);
  });

  it('reaches only the start cell with one tile on an empty board', () => {
    expect(readReachable(getReachableCells(emptyBoard, 1))).toEqual(['.....', '.....', '..#..', '.....', '.....']);
  });

  it('reaches along both axes through the start cell on an empty board', () => {
    expect(readReachable(getReachableCells(emptyBoard, 2))).toEqual(['.....', '..#..', '.###.', '..#..', '.....']);
  });

  it('reaches cells touching tiles with one tile', () => {
    expect(readReachable(getReachableCells(centerTile, 1))).toEqual(['.....', '..#..', '.###.', '..#..', '.....']);
  });

  it('reaches further, including diagonals, with more tiles', () => {
    expect(readReachable(getReachableCells(centerTile, 2))).toEqual(['..#..', '.###.', '#####', '.###.', '..#..']);
  });

  it('stops at the board edge', () => {
    const cornerTile = Board.fromStringArray(['a  ', '   ', '   ']);

    expect(readReachable(getReachableCells(cornerTile, 1))).toEqual(['##.', '#..', '...']);
  });

  it('does not count a run of tiles beyond the reach', () => {
    const board = Board.fromStringArray(['a    ', '     ', '     ', '     ', '     ']);

    expect(getReachableCells(board, 3)[0][4]).toBe(false);
    expect(getReachableCells(board, 4)[0][4]).toBe(true);
  });

  it('always reaches filled cells', () => {
    expect(getReachableCells(centerTile, 1)[2][2]).toBe(true);
  });
});

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
  return new Result({ cells, collisions: [], id: 0, locale: Locale.EN_US, points: 0 });
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

function readReachable(grid: boolean[][]): string[] {
  return grid.map((row) => row.map((isReachable) => (isReachable ? '#' : '.')).join(''));
}

function createBonus(bonus: Partial<Bonus>): Bonus {
  return bonus as Bonus;
}
