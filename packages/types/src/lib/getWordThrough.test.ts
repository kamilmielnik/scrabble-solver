import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { type BoardWord } from '../BoardWord';
import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { getWordThrough } from './getWordThrough';

describe('getWordThrough', () => {
  it.each([
    ['its first cell', 1],
    ['a middle cell', 2],
    ['its last cell', 3],
  ])('finds the horizontal word from %s', (_name, x) => {
    const board = Board.fromStringArray(['     ', ' cat ', '     ']);

    expect(getWordThrough(board, x, 1, 'horizontal')).toEqual({ direction: 'horizontal', word: 'cat', x: 1, y: 1 });
  });

  it.each([
    ['its first cell', 1],
    ['a middle cell', 2],
    ['its last cell', 3],
  ])('finds the vertical word from %s', (_name, y) => {
    const board = Board.fromStringArray(['   ', ' c ', ' a ', ' t ', '   ']);

    expect(getWordThrough(board, 1, y, 'vertical')).toEqual({ direction: 'vertical', word: 'cat', x: 1, y: 1 });
  });

  describe('at the board edges', () => {
    it.each<[string, string[], [number, number], BoardWord]>([
      ['the left edge', ['cat  '], [1, 0], horizontal('cat', 0, 0)],
      ['the right edge', ['  cat'], [3, 0], horizontal('cat', 2, 0)],
      ['the left and right edges', ['cats'], [2, 0], horizontal('cats', 0, 0)],
      ['the top edge', ['c', 'a', 't', ' ', ' '], [0, 1], vertical('cat', 0, 0)],
      ['the bottom edge', [' ', ' ', 'c', 'a', 't'], [0, 3], vertical('cat', 0, 2)],
      ['the top and bottom edges', ['c', 'a', 't', 's'], [0, 2], vertical('cats', 0, 0)],
      ['the top-left corner', ['at', 't '], [0, 0], horizontal('at', 0, 0)],
      ['the bottom-right corner', ['  ', ' a', 'ta'], [1, 2], vertical('aa', 1, 1)],
    ])('finds a word touching %s', (_name, rows, [x, y], word) => {
      expect(getWordThrough(Board.fromStringArray(rows), x, y, word.direction)).toEqual(word);
    });

    it('reads from the very last cell of a word ending at the right edge', () => {
      const board = Board.fromStringArray(['  cat']);

      expect(getWordThrough(board, 4, 0, 'horizontal')?.word).toBe('cat');
    });

    it('reads from the very last cell of a word ending at the bottom edge', () => {
      const board = Board.fromStringArray([' ', 'a', 't']);

      expect(getWordThrough(board, 0, 2, 'vertical')?.word).toBe('at');
    });
  });

  describe('on non-square boards', () => {
    it('reads down the full height of a wide board', () => {
      const board = Board.fromStringArray(['     a', '     t']);

      expect(getWordThrough(board, 5, 1, 'vertical')).toEqual({ direction: 'vertical', word: 'at', x: 5, y: 0 });
    });

    it('reads across the full width of a tall board', () => {
      const board = Board.fromStringArray(['  ', '  ', '  ', '  ', '  ', 'at']);

      expect(getWordThrough(board, 1, 5, 'horizontal')).toEqual({ direction: 'horizontal', word: 'at', x: 0, y: 5 });
    });
  });

  it('finds no word for a lone tile', () => {
    const board = Board.fromStringArray(['   ', ' a ', '   ']);

    expect(getWordThrough(board, 1, 1, 'horizontal')).toBeUndefined();
    expect(getWordThrough(board, 1, 1, 'vertical')).toBeUndefined();
  });

  it('finds no word for a lone tile in a corner', () => {
    const board = Board.fromStringArray(['a  ', '   ', '  a']);

    expect(getWordThrough(board, 0, 0, 'horizontal')).toBeUndefined();
    expect(getWordThrough(board, 2, 2, 'vertical')).toBeUndefined();
  });

  it('finds no word in the direction that has none', () => {
    const board = Board.fromStringArray(['   ', 'cat', '   ']);

    expect(getWordThrough(board, 1, 1, 'vertical')).toBeUndefined();
  });

  it('stops at gaps on both sides', () => {
    const board = Board.fromStringArray(['x cat y']);

    expect(getWordThrough(board, 3, 0, 'horizontal')).toEqual({ direction: 'horizontal', word: 'cat', x: 2, y: 0 });
  });

  it('does not read a candidate tile as part of the word', () => {
    const board = Board.fromStringArray(['at ']);
    board.updateCell(2, 0, () => new Cell({ isEmpty: true, tile: new Tile({ character: 's' }), x: 2, y: 0 }));

    expect(getWordThrough(board, 0, 0, 'horizontal')?.word).toBe('at');
  });

  it('spells a two-character tile in full', () => {
    const board = Board.fromStringArray(['  e']);
    board.updateCell(1, 0, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'ch' }), x: 1, y: 0 }));

    expect(getWordThrough(board, 2, 0, 'horizontal')).toEqual({ direction: 'horizontal', word: 'che', x: 1, y: 0 });
  });
});

function horizontal(word: string, x: number, y: number): BoardWord {
  return { direction: 'horizontal', word, x, y };
}

function vertical(word: string, x: number, y: number): BoardWord {
  return { direction: 'vertical', word, x, y };
}
