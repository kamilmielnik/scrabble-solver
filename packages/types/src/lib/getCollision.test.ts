import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { getCollision } from './getCollision';

type Placement = [x: number, y: number, isHorizontal: boolean];
type Expected = [word: string, coordinates: string];

const ACROSS = true;
const DOWN = false;

describe('getCollision', () => {
  describe('at the board edges', () => {
    it.each<[string, string[], Placement, Expected]>([
      ['the top edge', ['   ', ' a ', ' b '], [1, 0, ACROSS], ['zab', '1,0 1,1 1,2']],
      ['the bottom edge', [' a ', ' b ', '   '], [1, 2, ACROSS], ['abz', '1,0 1,1 1,2']],
      ['the left edge', ['   ', ' ab', '   '], [0, 1, DOWN], ['zab', '0,1 1,1 2,1']],
      ['the right edge', ['   ', 'ab ', '   '], [2, 1, DOWN], ['abz', '0,1 1,1 2,1']],
      ['the top-left corner, reading down', ['   ', 'a  ', 'b  '], [0, 0, ACROSS], ['zab', '0,0 0,1 0,2']],
      ['the top-left corner, reading across', [' ab', '   ', '   '], [0, 0, DOWN], ['zab', '0,0 1,0 2,0']],
      ['the top-right corner, reading down', ['   ', '  a', '  b'], [2, 0, ACROSS], ['zab', '2,0 2,1 2,2']],
      ['the top-right corner, reading across', ['ab ', '   ', '   '], [2, 0, DOWN], ['abz', '0,0 1,0 2,0']],
      ['the bottom-left corner, reading down', ['a  ', 'b  ', '   '], [0, 2, ACROSS], ['abz', '0,0 0,1 0,2']],
      ['the bottom-left corner, reading across', ['   ', '   ', ' ab'], [0, 2, DOWN], ['zab', '0,2 1,2 2,2']],
      ['the bottom-right corner, reading down', ['  a', '  b', '   '], [2, 2, ACROSS], ['abz', '2,0 2,1 2,2']],
      ['the bottom-right corner, reading across', ['   ', '   ', 'ab '], [2, 2, DOWN], ['abz', '0,2 1,2 2,2']],
    ])('reads the word through a tile placed at %s', (_name, rows, [x, y, isHorizontal], [word, coordinates]) => {
      const collision = getCollision(placeAt(x, y), Board.fromStringArray(rows), isHorizontal);

      expect(spell(collision)).toBe(word);
      expect(locate(collision)).toBe(coordinates);
    });

    it.each([
      ['top-left', 0, 0],
      ['top-right', 2, 0],
      ['bottom-left', 0, 2],
      ['bottom-right', 2, 2],
    ])('reads only the placed tile when the %s corner has no neighbor', (_name, x, y) => {
      const board = Board.fromStringArray(['   ', '   ', '   ']);

      expect(spell(getCollision(placeAt(x, y), board, ACROSS))).toBe('z');
      expect(spell(getCollision(placeAt(x, y), board, DOWN))).toBe('z');
    });

    it('reads a word spanning the whole column', () => {
      const board = Board.fromStringArray(['a', 'b', ' ', 'c', 'd']);

      expect(spell(getCollision(placeAt(0, 2), board, ACROSS))).toBe('abzcd');
    });

    it('reads a word spanning the whole row', () => {
      const board = Board.fromStringArray(['ab cd']);

      expect(spell(getCollision(placeAt(2, 0), board, DOWN))).toBe('abzcd');
    });

    it('handles a board of a single cell', () => {
      expect(spell(getCollision(placeAt(0, 0), Board.fromStringArray([' ']), ACROSS))).toBe('z');
      expect(spell(getCollision(placeAt(0, 0), Board.fromStringArray([' ']), DOWN))).toBe('z');
    });
  });

  describe('on non-square boards', () => {
    const wide = Board.fromStringArray(['  a   ', '  b   ']);
    const tall = Board.fromStringArray(['  ', 'a ', 'b ', '  ', '  ', ' c']);

    it('reads across the last row of a wide board', () => {
      expect(spell(getCollision(placeAt(3, 1), wide, DOWN))).toBe('bz');
    });

    it('stops reading down at the bottom of a wide board', () => {
      expect(spell(getCollision(placeAt(3, 0), Board.fromStringArray(['      ', '   b  ']), ACROSS))).toBe('zb');
    });

    it('stops reading across at the right of a tall board', () => {
      expect(spell(getCollision(placeAt(1, 1), tall, DOWN))).toBe('az');
      expect(spell(getCollision(placeAt(0, 5), tall, DOWN))).toBe('zc');
    });

    it('reads down a tall board past the width of the board', () => {
      expect(spell(getCollision(placeAt(0, 3), tall, ACROSS))).toBe('abz');
      expect(locate(getCollision(placeAt(0, 3), tall, ACROSS))).toBe('0,1 0,2 0,3');
    });

    it('reads across a wide board past the height of the board', () => {
      const board = Board.fromStringArray(['     a', '      ']);

      expect(locate(getCollision(placeAt(4, 0), board, DOWN))).toBe('4,0 5,0');
    });
  });

  describe('word limits', () => {
    it('stops at the first gap on each side', () => {
      const board = Board.fromStringArray(['x', ' ', 'a', ' ', 'b', ' ', 'y']);

      expect(spell(getCollision(placeAt(0, 3), board, ACROSS))).toBe('azb');
    });

    it('does not read a candidate tile as part of the word', () => {
      const board = Board.fromStringArray(['a', ' ', ' ', ' ', 'b']);
      board.updateCell(0, 1, () => placeAt(0, 1, 'x'));
      board.updateCell(0, 3, () => placeAt(0, 3, 'y'));

      expect(spell(getCollision(placeAt(0, 2), board, ACROSS))).toBe('z');
    });

    it('replaces a candidate at the placed position', () => {
      const board = Board.fromStringArray(['a', ' ', 'b']);
      board.updateCell(0, 1, () => placeAt(0, 1, 'x'));

      expect(spell(getCollision(placeAt(0, 1), board, ACROSS))).toBe('azb');
    });
  });

  it('returns the placed cell itself and copies of the board cells', () => {
    const board = Board.fromStringArray(['a', ' ', 'b']);
    const placed = placeAt(0, 1);
    const collision = getCollision(placed, board, ACROSS);

    expect(collision[1]).toBe(placed);
    expect(collision[0]).not.toBe(board.rows[0][0]);
    expect(collision[0].equals(board.rows[0][0])).toBe(true);
  });

  it('keeps blanks and two-character tiles of the crossed word', () => {
    const board = Board.create(1, 3);
    board.updateCell(
      0,
      0,
      () => new Cell({ isEmpty: false, tile: new Tile({ character: 'ch', isBlank: true }), x: 0, y: 0 }),
    );
    const collision = getCollision(placeAt(0, 1), board, ACROSS);

    expect(spell(collision)).toBe('chz');
    expect(collision[0].tile.isBlank).toBe(true);
  });
});

function placeAt(x: number, y: number, character = 'z'): Cell {
  return new Cell({ isEmpty: true, tile: new Tile({ character }), x, y });
}

function spell(cells: Cell[]): string {
  return cells.map(String).join('');
}

function locate(cells: Cell[]): string {
  return cells.map(({ x, y }) => `${x},${y}`).join(' ');
}
