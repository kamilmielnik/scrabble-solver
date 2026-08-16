import { describe, expect, it } from 'bun:test';

import { Board } from './Board';
import { Cell } from './Cell';
import { Tile } from './Tile';

describe('Board.getWords', () => {
  it('returns no words for an empty board', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);

    expect(board.getWords()).toEqual([]);
  });

  it('locates a horizontal word', () => {
    const board = Board.fromStringArray(['     ', ' cat ', '     ', '     ', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'cat', x: 1, y: 1 }]);
  });

  it('locates a vertical word', () => {
    const board = Board.fromStringArray(['     ', '  c  ', '  a  ', '  t  ', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'vertical', word: 'cat', x: 2, y: 1 }]);
  });

  it('locates crossing words in both directions', () => {
    const board = Board.fromStringArray(['     ', ' cat ', ' o   ', ' d   ', '     ']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'cat', x: 1, y: 1 },
      { direction: 'vertical', word: 'cod', x: 1, y: 1 },
    ]);
  });

  it('distinguishes the same word at different positions', () => {
    const board = Board.fromStringArray(['cat  ', '     ', '  cat', '     ', '     ']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'cat', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cat', x: 2, y: 2 },
    ]);
  });

  it('skips single-tile runs', () => {
    const board = Board.fromStringArray(['     ', ' a   ', '     ', '   to', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'to', x: 3, y: 3 }]);
  });

  it('locates a word with a digraph tile occupying a single cell', () => {
    const board = createBoardWithCharacters([
      ['', '', ''],
      ['', 'ch', 'e'],
      ['', '', ''],
    ]);

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'che', x: 1, y: 1 }]);
  });
});

const createBoardWithCharacters = (characters: string[][]): Board => {
  return new Board({
    rows: characters.map((row, y) =>
      row.map(
        (character, x) =>
          new Cell({
            isEmpty: !character,
            tile: character ? new Tile({ character }) : Tile.Null,
            x,
            y,
          }),
      ),
    ),
  });
};
