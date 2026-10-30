import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';
import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { getWordsInRows } from './getWordsInRows';

describe('getWordsInRows', () => {
  it('finds nothing without rows', () => {
    expect(getWordsInRows([], 'horizontal')).toEqual([]);
  });

  it('finds nothing in a row without cells', () => {
    expect(getWordsInRows([[]], 'horizontal')).toEqual([]);
  });

  it('finds several words in one row', () => {
    expect(getWordsInRows(rows(['ab cd ef']), 'horizontal')).toEqual([
      { direction: 'horizontal', word: 'ab', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cd', x: 3, y: 0 },
      { direction: 'horizontal', word: 'ef', x: 6, y: 0 },
    ]);
  });

  it('keeps a word that runs to the end of its row', () => {
    expect(getWordsInRows(rows(['  ab']), 'horizontal')).toEqual([{ direction: 'horizontal', word: 'ab', x: 2, y: 0 }]);
  });

  it('does not carry a word over into the next row', () => {
    expect(getWordsInRows(rows(['  a', 'b  ']), 'horizontal')).toEqual([]);
  });

  it('skips a lone tile at the end of a row', () => {
    expect(getWordsInRows(rows(['ab c']), 'horizontal')).toEqual([{ direction: 'horizontal', word: 'ab', x: 0, y: 0 }]);
  });

  it('skips a lone tile between gaps', () => {
    expect(getWordsInRows(rows([' a b ']), 'horizontal')).toEqual([]);
  });

  it('labels words with the given direction', () => {
    expect(getWordsInRows(rows(['ab']), 'vertical')).toEqual([{ direction: 'vertical', word: 'ab', x: 0, y: 0 }]);
  });

  it('splits a word at a candidate tile', () => {
    const cells = rows(['ab cd']);
    cells[0][2] = new Cell({ isEmpty: true, tile: new Tile({ character: 'z' }), x: 2, y: 0 });

    expect(getWordsInRows(cells, 'horizontal')).toEqual([
      { direction: 'horizontal', word: 'ab', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cd', x: 3, y: 0 },
    ]);
  });
});

function rows(strings: string[]): Cell[][] {
  return Board.fromStringArray(strings).rows;
}
