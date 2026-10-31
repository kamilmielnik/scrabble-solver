import { BLANK } from '@scrabble-solver/constants';
import { Cell, Tile } from '@scrabble-solver/types';

import { arrayEquals } from './arrayEquals';
import { findCell } from './findCell';
import { isStringArray } from './isStringArray';
import { unorderedArraysEqual } from './unorderedArraysEqual';
import { zipCharactersAndTiles } from './zipCharactersAndTiles';

describe('arrayEquals', () => {
  it('compares elements in order', () => {
    expect(arrayEquals(['a', null], ['a', null])).toBe(true);
    expect(arrayEquals(['a', 'b'], ['b', 'a'])).toBe(false);
  });

  it('rejects different lengths', () => {
    expect(arrayEquals(['a'], ['a', 'b'])).toBe(false);
    expect(arrayEquals(['a', 'b'], ['a'])).toBe(false);
  });

  it('treats empty arrays as equal', () => {
    expect(arrayEquals([], [])).toBe(true);
  });
});

describe('unorderedArraysEqual', () => {
  it('ignores order', () => {
    expect(unorderedArraysEqual(['b', 'a'], ['a', 'b'], 'en-US')).toBe(true);
  });

  it('respects duplicates', () => {
    expect(unorderedArraysEqual(['a', 'a', 'b'], ['a', 'b', 'b'], 'en-US')).toBe(false);
  });

  it('rejects different lengths', () => {
    expect(unorderedArraysEqual(['a'], ['a', 'a'], 'en-US')).toBe(false);
  });

  it('does not mutate its input', () => {
    const input = ['b', 'a'];

    unorderedArraysEqual(input, ['a', 'b'], 'en-US');

    expect(input).toEqual(['b', 'a']);
  });
});

describe('findCell', () => {
  const cells = [new Cell({ x: 1, y: 2 }), new Cell({ x: 2, y: 1 })];

  it('finds a cell by both coordinates', () => {
    expect(findCell(cells, 2, 1)).toBe(cells[1]);
  });

  it('is undefined when no cell matches', () => {
    expect(findCell(cells, 1, 1)).toBeUndefined();
  });
});

describe('isStringArray', () => {
  it('accepts arrays of strings, including empty ones', () => {
    expect(isStringArray(['a'])).toBe(true);
    expect(isStringArray([])).toBe(true);
  });

  it.each([['a'], [null], [{ length: 0 }], [['a', 1]]])('rejects %j', (value) => {
    expect(isStringArray(value)).toBe(false);
  });
});

describe('zipCharactersAndTiles', () => {
  const a = new Tile({ character: 'a' });
  const blank = new Tile({ character: 'x', isBlank: true });

  it('pairs each character with the matching tile', () => {
    expect(zipCharactersAndTiles(['a', 'b'], [a])).toEqual([
      { character: 'a', tile: a },
      { character: 'b', tile: null },
    ]);
  });

  it('uses each tile once', () => {
    expect(zipCharactersAndTiles(['a', 'a'], [a])).toEqual([
      { character: 'a', tile: a },
      { character: 'a', tile: null },
    ]);
  });

  it('pairs a blank with a blank tile whatever letter it plays', () => {
    expect(zipCharactersAndTiles([BLANK], [blank])).toEqual([{ character: BLANK, tile: blank }]);
  });

  it('does not pair a letter with a blank tile of that letter', () => {
    const blankA = new Tile({ character: 'a', isBlank: true });

    expect(zipCharactersAndTiles([BLANK, 'a'], [blankA, a])).toEqual([
      { character: BLANK, tile: blankA },
      { character: 'a', tile: a },
    ]);
  });

  it('leaves empty slots unpaired', () => {
    expect(zipCharactersAndTiles([null], [a])).toEqual([{ character: null, tile: null }]);
  });
});
