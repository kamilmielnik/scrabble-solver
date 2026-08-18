import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { Cell } from '../Cell';
import { type ResultJson } from '../ResultJson';
import { Tile } from '../Tile';

import { readCells, readCollisions } from './readResultCells';

describe('readCells', () => {
  it('reads a word placed on an empty board', () => {
    const board = createBoard();
    const cells = readCells(createResultJson({ tiles: ['a', 'b', 'c'], x: 1, y: 2 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(toCoordinates(cells)).toBe('1,2 2,2 3,2');
    expect(cells.every((cell) => cell.isEmpty)).toBe(true);
  });

  it('reads a word played through existing board tiles', () => {
    const board = createBoard(['     ', '     ', ' a c ', '     ', '     ']);
    const cells = readCells(createResultJson({ tiles: ['b'], x: 1, y: 2 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(cells.map((cell) => cell.isEmpty)).toEqual([false, true, false]);
    expect(toWord(placedCells(cells))).toBe('b');
  });

  it('reads a vertical word', () => {
    const board = createBoard(['     ', '  a  ', '     ', '     ', '     ']);
    const cells = readCells(createResultJson({ isHorizontal: false, tiles: ['b', 'c'], x: 2, y: 1 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(toCoordinates(cells)).toBe('2,1 2,2 2,3');
  });

  it('marks placed blanks by their index among placed tiles', () => {
    const board = createBoard(['     ', '     ', ' a   ', '     ', '     ']);
    const cells = readCells(createResultJson({ blankIndices: [1], tiles: ['b', 'c'], x: 1, y: 2 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(cells.map((cell) => cell.tile.isBlank)).toEqual([false, false, true]);
  });

  it('stops at the board edge', () => {
    const board = createBoard();
    const cells = readCells(createResultJson({ tiles: ['a', 'b', 'c'], x: 3, y: 2 }), board);

    expect(toWord(cells)).toBe('ab');
    expect(toCoordinates(cells)).toBe('3,2 4,2');
  });

  it('treats a candidate cell as empty', () => {
    const board = createBoard();
    board.updateCell(2, 2, () => new Cell({ isEmpty: true, tile: new Tile({ character: 'z' }), x: 2, y: 2 }));
    const cells = readCells(createResultJson({ tiles: ['a', 'b', 'c'], x: 1, y: 2 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(cells.every((cell) => cell.isEmpty)).toBe(true);
  });

  it('treats a cell without a tile as empty, matching the solver', () => {
    const board = createBoard();
    board.updateCell(2, 2, () => new Cell({ isEmpty: false, tile: Tile.Null, x: 2, y: 2 }));
    const cells = readCells(createResultJson({ tiles: ['a', 'b', 'c'], x: 1, y: 2 }), board);

    expect(toWord(cells)).toBe('abc');
    expect(toWord(placedCells(cells))).toBe('abc');
  });
});

describe('readCollisions', () => {
  it('reads the perpendicular word crossing a placed tile', () => {
    const board = createBoard(['     ', '  a  ', '   d ', '  c  ', '     ']);
    const cells = readCells(createResultJson({ tiles: ['b'], x: 2, y: 2 }), board);
    const collisions = readCollisions(cells, board, true);

    expect(collisions.map(toWord)).toEqual(['abc']);
    expect(toCoordinates(collisions[0])).toBe('2,1 2,2 2,3');
  });

  it('reads a horizontal collision crossing a vertical word', () => {
    const board = createBoard(['     ', ' a c ', '     ', '     ', '     ']);
    const cells = readCells(createResultJson({ isHorizontal: false, tiles: ['b', 'd'], x: 2, y: 1 }), board);
    const collisions = readCollisions(cells, board, false);

    expect(toWord(cells)).toBe('bd');
    expect(collisions.map(toWord)).toEqual(['abc']);
  });

  it('reads one collision per placed tile', () => {
    const board = createBoard(['  a a', '     ', '     ', '     ', '     ']);
    const cells = readCells(createResultJson({ tiles: ['b', 'c', 'b'], x: 2, y: 1 }), board);

    expect(readCollisions(cells, board, true).map(toWord)).toEqual(['ab', 'ab']);
  });

  it('ignores placed tiles without a perpendicular neighbour', () => {
    const board = createBoard();
    const cells = readCells(createResultJson({ tiles: ['a', 'b'], x: 1, y: 2 }), board);

    expect(readCollisions(cells, board, true)).toEqual([]);
  });

  it('does not cross a candidate cell', () => {
    const board = createBoard();
    board.updateCell(2, 1, () => new Cell({ isEmpty: true, tile: new Tile({ character: 'z' }), x: 2, y: 1 }));
    const cells = readCells(createResultJson({ tiles: ['a', 'b', 'c'], x: 1, y: 2 }), board);

    expect(readCollisions(cells, board, true)).toEqual([]);
  });
});

function createBoard(rows: string[] = ['     ', '     ', '     ', '     ', '     ']): Board {
  return Board.fromStringArray(rows);
}

function createResultJson(json: Partial<ResultJson> = {}): ResultJson {
  return {
    blankIndices: [],
    id: 0,
    isHorizontal: true,
    points: 0,
    tiles: [],
    x: 0,
    y: 0,
    ...json,
  };
}

function placedCells(cells: Cell[]): Cell[] {
  return cells.filter((cell) => cell.isEmpty);
}

function toWord(cells: Cell[]): string {
  return cells.map(String).join('');
}

function toCoordinates(cells: Cell[]): string {
  return cells.map(({ x, y }) => `${x},${y}`).join(' ');
}
