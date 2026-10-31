import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { type BoardWord } from '../BoardWord';
import { Cell } from '../Cell';
import { type Direction } from '../Direction';
import { Tile } from '../Tile';

import { getCollidingWords } from './getCollidingWords';

describe('getCollidingWords', () => {
  it('reads vertical words across a horizontal word', () => {
    const board = Board.fromStringArray(['  ', 'at', 'to']);

    expect(getCollidingWords(board, word('horizontal', 'at', 0, 1))).toEqual([
      word('vertical', 'at', 0, 1),
      word('vertical', 'to', 1, 1),
    ]);
  });

  it('reads horizontal words across a vertical word', () => {
    const board = Board.fromStringArray([' at', ' to']);

    expect(getCollidingWords(board, word('vertical', 'at', 1, 0))).toEqual([
      word('horizontal', 'at', 1, 0),
      word('horizontal', 'to', 1, 1),
    ]);
  });

  it('skips the cells without a crossing word', () => {
    const board = Board.fromStringArray(['  a  ', 'scout', '  e  ']);

    expect(getCollidingWords(board, word('horizontal', 'scout', 0, 1))).toEqual([word('vertical', 'aoe', 2, 0)]);
  });

  it('reads through a crossing word entered at its end', () => {
    const board = Board.fromStringArray(['c    ', 'a    ', 'trip ']);

    expect(getCollidingWords(board, word('horizontal', 'trip', 0, 2))).toEqual([word('vertical', 'cat', 0, 0)]);
  });

  it('stops at the right edge', () => {
    const board = Board.fromStringArray(['   a', 'cats']);

    expect(getCollidingWords(board, word('horizontal', 'cats', 0, 1))).toEqual([word('vertical', 'as', 3, 0)]);
  });

  it('stops at the bottom edge', () => {
    const board = Board.fromStringArray(['c ', 'a ', 'to']);

    expect(getCollidingWords(board, word('vertical', 'cat', 0, 0))).toEqual([word('horizontal', 'to', 0, 2)]);
  });

  it('stops at the first gap, so a further word in line is not read', () => {
    const board = Board.fromStringArray(['    a', 'at at', '     ']);

    expect(getCollidingWords(board, word('horizontal', 'at', 0, 1))).toEqual([]);
  });

  it('works past the height of a wide board', () => {
    const board = Board.fromStringArray(['      a', 'playing']);

    expect(getCollidingWords(board, word('horizontal', 'playing', 0, 1))).toEqual([word('vertical', 'ag', 6, 0)]);
  });

  it('works past the width of a tall board', () => {
    const board = Board.fromStringArray(['  ', '  ', 'a ', 'b ', 'c ', 'dd']);

    expect(getCollidingWords(board, word('vertical', 'abcd', 0, 2))).toEqual([word('horizontal', 'dd', 0, 5)]);
  });

  it('finds nothing for a word that no longer starts on a tile', () => {
    const board = Board.fromStringArray(['   ', 'at ', 'a  ']);

    expect(getCollidingWords(board, word('horizontal', 'at', 2, 1))).toEqual([]);
  });

  it('finds nothing for a word starting off the board', () => {
    const board = Board.fromStringArray(['at']);

    expect(getCollidingWords(board, word('horizontal', 'at', 2, 0))).toEqual([]);
    expect(getCollidingWords(board, word('vertical', 'at', 0, 1))).toEqual([]);
  });

  it('stops at a candidate tile, so a word in line beyond it is not read', () => {
    const board = Board.fromStringArray(['   a', 'at c', '   b']);
    board.updateCell(2, 1, () => new Cell({ isEmpty: true, tile: new Tile({ character: 's' }), x: 2, y: 1 }));

    expect(getCollidingWords(board, word('horizontal', 'at', 0, 1))).toEqual([]);
  });

  it('keeps equal texts apart when they are different crossings', () => {
    const board = Board.fromStringArray(['at', 'to', 'at']);

    expect(getCollidingWords(board, word('vertical', 'ata', 0, 0))).toEqual([
      word('horizontal', 'at', 0, 0),
      word('horizontal', 'to', 0, 1),
      word('horizontal', 'at', 0, 2),
    ]);
  });
});

function word(direction: Direction, text: string, x: number, y: number): BoardWord {
  return { direction, word: text, x, y };
}
