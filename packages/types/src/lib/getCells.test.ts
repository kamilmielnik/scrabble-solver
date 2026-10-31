/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { getCells } from './getCells';

describe('getCells', () => {
  it('reads a word placed on an empty board', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 1,
      y: 2,
    });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.map(({ x, y }) => `${x},${y}`).join(' ')).toBe('1,2 2,2 3,2');
    expect(cells.every((cell) => cell.isEmpty)).toBe(true);
  });

  it('reads a word played through existing board tiles', () => {
    const board = Board.fromStringArray(['     ', '     ', ' a c ', '     ', '     ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['b'], x: 1, y: 2 });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.map((cell) => cell.isEmpty)).toEqual([false, true, false]);
    expect(
      cells
        .filter((cell) => cell.isEmpty)
        .map(String)
        .join(''),
    ).toBe('b');
  });

  it('reads a vertical word', () => {
    const board = Board.fromStringArray(['     ', '  a  ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['b', 'c'],
      x: 2,
      y: 1,
    });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.map(({ x, y }) => `${x},${y}`).join(' ')).toBe('2,1 2,2 2,3');
  });

  it('marks placed blanks by their index among placed tiles', () => {
    const board = Board.fromStringArray(['     ', '     ', ' a   ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [1],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['b', 'c'],
      x: 1,
      y: 2,
    });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.map((cell) => cell.tile.isBlank)).toEqual([false, false, true]);
  });

  it('stops at the board edge', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 3,
      y: 2,
    });

    expect(cells.map(String).join('')).toBe('ab');
    expect(cells.map(({ x, y }) => `${x},${y}`).join(' ')).toBe('3,2 4,2');
  });

  it('treats a candidate cell as empty', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    board.updateCell(2, 2, () => new Cell({ isEmpty: true, tile: new Tile({ character: 'z' }), x: 2, y: 2 }));
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 1,
      y: 2,
    });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.every((cell) => cell.isEmpty)).toBe(true);
  });

  it('treats a cell without a tile as empty, matching the solver', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    board.updateCell(2, 2, () => new Cell({ isEmpty: false, tile: Tile.Null, x: 2, y: 2 }));
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 1,
      y: 2,
    });

    expect(cells.map(String).join('')).toBe('abc');
    expect(
      cells
        .filter((cell) => cell.isEmpty)
        .map(String)
        .join(''),
    ).toBe('abc');
  });

  it('reads board tiles at the start of the word before any placed tile', () => {
    const board = Board.fromStringArray(['     ', 'ab   ', '     ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['c'], x: 0, y: 1 });

    expect(cells.map(String).join('')).toBe('abc');
    expect(cells.map((cell) => cell.isEmpty)).toEqual([false, false, true]);
  });

  it('keeps reading the board tiles that follow the last placed tile', () => {
    const board = Board.fromStringArray(['  bc ', '     ', '     ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['a'], x: 1, y: 0 });

    expect(cells.map(String).join('')).toBe('abc');
  });

  it('ends the word at the first empty cell once every tile is placed', () => {
    const board = Board.fromStringArray(['     ', '     ', ' a  b']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['c'], x: 1, y: 2 });

    expect(cells.map(String).join('')).toBe('ac');
  });

  it('stops a vertical word at the bottom edge', () => {
    const board = Board.fromStringArray(['  ', '  ', '  ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 1,
      y: 1,
    });

    expect(cells.map(({ x, y }) => `${x},${y}`).join(' ')).toBe('1,1 1,2');
  });

  it('reads a word running to the far edges of a non-square board', () => {
    const board = Board.fromStringArray(['   ', '   ', '   ', '   ', '   ', '   ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['a', 'b', 'c', 'd', 'e', 'f'],
      x: 2,
      y: 0,
    });

    expect(cells.map(String).join('')).toBe('abcdef');
  });

  it('copies board cells instead of sharing them with the board', () => {
    const board = Board.fromStringArray(['ab']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: [], x: 0, y: 0 });

    expect(cells[0]).not.toBe(board.rows[0][0]);
    expect(cells[0].equals(board.rows[0][0])).toBe(true);
  });

  it('reads no cells without tiles to place on an empty cell', () => {
    const board = Board.fromStringArray(['  ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: [], x: 0, y: 0 });

    expect(cells).toEqual([]);
  });

  it('keeps a two-character tile in one cell', () => {
    const board = Board.fromStringArray(['   ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['ch', 'a'],
      x: 0,
      y: 0,
    });

    expect(cells).toHaveLength(2);
    expect(cells[0].tile.character).toBe('ch');
    expect(cells[1].x).toBe(1);
  });
});
