import { describe, expect, it } from 'bun:test';

import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { toBoardWord } from './toBoardWord';

describe('toBoardWord', () => {
  it('spells the word and places it at its first cell', () => {
    expect(toBoardWord([filledCell('c', 3, 4), filledCell('a', 4, 4), filledCell('t', 5, 4)], 'horizontal')).toEqual({
      direction: 'horizontal',
      word: 'cat',
      x: 3,
      y: 4,
    });
  });

  it('keeps the given direction', () => {
    expect(toBoardWord([filledCell('a', 0, 1), filledCell('t', 0, 2)], 'vertical').direction).toBe('vertical');
  });

  it('spells a two-character tile in full', () => {
    expect(toBoardWord([filledCell('ch', 0, 0), filledCell('e', 1, 0)], 'horizontal').word).toBe('che');
  });

  it('spells a blank as the letter it stands for', () => {
    const blank = new Cell({ isEmpty: false, tile: new Tile({ character: 'a', isBlank: true }), x: 0, y: 0 });

    expect(toBoardWord([blank, filledCell('t', 1, 0)], 'horizontal').word).toBe('at');
  });
});

function filledCell(character: string, x: number, y: number): Cell {
  return new Cell({ isEmpty: false, tile: new Tile({ character }), x, y });
}
