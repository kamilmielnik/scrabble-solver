import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';

import { getBoardWords } from './getBoardWords';

describe('getBoardWords', () => {
  it('lists horizontal words before vertical words, each top-left first', () => {
    const board = Board.fromStringArray(['ab cd', 'e    ', 'f gh ']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'ab', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cd', x: 3, y: 0 },
      { direction: 'horizontal', word: 'gh', x: 2, y: 2 },
      { direction: 'vertical', word: 'aef', x: 0, y: 0 },
    ]);
  });

  it('reads words filling a whole row and a whole column', () => {
    const board = Board.fromStringArray(['abc', 'd  ', 'e  ']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'abc', x: 0, y: 0 },
      { direction: 'vertical', word: 'ade', x: 0, y: 0 },
    ]);
  });

  it('reads words ending at the right and bottom edges', () => {
    const board = Board.fromStringArray(['    ', '  ab', '   c']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'ab', x: 2, y: 1 },
      { direction: 'vertical', word: 'bc', x: 3, y: 1 },
    ]);
  });

  it('keeps the real coordinates on a wide board', () => {
    const board = Board.fromStringArray(['     a', '  bc d']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'bc', x: 2, y: 1 },
      { direction: 'vertical', word: 'ad', x: 5, y: 0 },
    ]);
  });

  it('keeps the real coordinates on a tall board', () => {
    const board = Board.fromStringArray(['  ', ' a', ' b', '  ', 'cd', '  ']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'cd', x: 0, y: 4 },
      { direction: 'vertical', word: 'ab', x: 1, y: 1 },
    ]);
  });

  it('reads a board of a single row', () => {
    expect(getBoardWords(Board.fromStringArray(['ab cd']))).toEqual([
      { direction: 'horizontal', word: 'ab', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cd', x: 3, y: 0 },
    ]);
  });

  it('reads a board of a single column', () => {
    expect(getBoardWords(Board.fromStringArray(['a', 'b', ' ', 'c']))).toEqual([
      { direction: 'vertical', word: 'ab', x: 0, y: 0 },
    ]);
  });

  it('lists the same text once per direction when two words share a start', () => {
    const board = Board.fromStringArray(['aba', 'b  ', 'a  ']);

    expect(getBoardWords(board)).toEqual([
      { direction: 'horizontal', word: 'aba', x: 0, y: 0 },
      { direction: 'vertical', word: 'aba', x: 0, y: 0 },
    ]);
  });
});
