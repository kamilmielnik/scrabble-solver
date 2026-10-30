import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { getCells } from './getCells';
import { getCollisions } from './getCollisions';

describe('getCollisions', () => {
  it('reads the perpendicular word crossing a placed tile', () => {
    const board = Board.fromStringArray(['     ', '  a  ', '   d ', '  c  ', '     ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['b'], x: 2, y: 2 });
    const collisions = getCollisions(board, cells, true);

    expect(collisions.map((collision) => collision.map(String).join(''))).toEqual(['abc']);
    expect(collisions[0].map(({ x, y }) => `${x},${y}`).join(' ')).toBe('2,1 2,2 2,3');
  });

  it('reads a horizontal collision crossing a vertical word', () => {
    const board = Board.fromStringArray(['     ', ' a c ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['b', 'd'],
      x: 2,
      y: 1,
    });
    const collisions = getCollisions(board, cells, false);

    expect(cells.map(String).join('')).toBe('bd');
    expect(collisions.map((collision) => collision.map(String).join(''))).toEqual(['abc']);
  });

  it('reads one collision per placed tile', () => {
    const board = Board.fromStringArray(['  a a', '     ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['b', 'c', 'b'],
      x: 2,
      y: 1,
    });

    expect(getCollisions(board, cells, true).map((collision) => collision.map(String).join(''))).toEqual(['ab', 'ab']);
  });

  it('ignores placed tiles without a perpendicular neighbour', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b'],
      x: 1,
      y: 2,
    });

    expect(getCollisions(board, cells, true)).toEqual([]);
  });

  it('does not cross a candidate cell', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);
    board.updateCell(2, 1, () => new Cell({ isEmpty: true, tile: new Tile({ character: 'z' }), x: 2, y: 1 }));
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['a', 'b', 'c'],
      x: 1,
      y: 2,
    });

    expect(getCollisions(board, cells, true)).toEqual([]);
  });

  it('skips board tiles of the main word even when they have perpendicular neighbours', () => {
    const board = Board.fromStringArray([' wx  ', ' a   ', '  y  ']);
    const cells = getCells(board, { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: ['b'], x: 1, y: 1 });

    expect(cells.map(String).join('')).toBe('ab');
    expect(getCollisions(board, cells, true).map(spell)).toEqual(['xby']);
  });

  it('skips a board tile of a vertical word', () => {
    const board = Board.fromStringArray(['     ', ' xa  ', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['b'],
      x: 2,
      y: 1,
    });

    expect(cells.map(String).join('')).toBe('ab');
    expect(getCollisions(board, cells, false)).toEqual([]);
  });

  it('reads collisions in the order of the word', () => {
    const board = Board.fromStringArray(['a b c', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['x', 'y', 'z', 'q', 'r'],
      x: 0,
      y: 1,
    });

    expect(getCollisions(board, cells, true).map(spell)).toEqual(['ax', 'bz', 'cr']);
  });

  it('reads a collision in the last column of a wide board', () => {
    const board = Board.fromStringArray(['    a', '     ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: true,
      points: 0,
      tiles: ['b', 'c'],
      x: 3,
      y: 1,
    });

    expect(getCollisions(board, cells, true).map(spell)).toEqual(['ac']);
  });

  it('reads a collision in the last row of a tall board', () => {
    const board = Board.fromStringArray(['  ', '  ', '  ', 'a ']);
    const cells = getCells(board, {
      blankIndices: [],
      id: 0,
      isHorizontal: false,
      points: 0,
      tiles: ['b', 'c'],
      x: 1,
      y: 2,
    });

    expect(getCollisions(board, cells, false).map(spell)).toEqual(['ac']);
  });

  it('has nothing to read without cells', () => {
    expect(getCollisions(Board.fromStringArray(['a']), [], true)).toEqual([]);
  });
});

function spell(cells: Cell[]): string {
  return cells.map(String).join('');
}
