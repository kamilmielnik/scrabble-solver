import { createResult } from '../../test/fixtures';
import { type CellFilter, ResultColumnId, SortDirection } from '../../types';

import { getCoordinates, groupResults, resultMatchesCellFilter, sortResults } from './lib';

describe('getCoordinates', () => {
  it('reads row first for horizontal results', () => {
    expect(getCoordinates(createResult({ x: 3, y: 1 }), 'original')).toBe('2D');
  });

  it('reads column first for vertical results', () => {
    expect(getCoordinates(createResult({ isHorizontal: false, x: 3, y: 1 }), 'original')).toBe('D2');
  });

  it('swaps letters and numbers in alternative mode', () => {
    expect(getCoordinates(createResult({ x: 3, y: 1 }), 'alternative')).toBe('B4');
  });
});

describe('groupResults', () => {
  const cat = createResult({ id: 1, word: 'cat', x: 0, y: 0 });
  const dog = createResult({ id: 2, word: 'dog', x: 5, y: 5 });

  it('is undefined for undefined results', () => {
    expect(groupResults(undefined, '', [])).toBeUndefined();
  });

  it('treats everything as matching with an empty query', () => {
    expect(groupResults([cat, dog], '', [])).toEqual({ matching: [cat, dog], other: [] });
  });

  it('matches case-insensitively as a regular expression', () => {
    expect(groupResults([cat, dog], '^C.T$', [])).toEqual({ matching: [cat], other: [dog] });
  });

  it('treats an invalid regular expression as no query', () => {
    expect(groupResults([cat], '(', [])).toEqual({ matching: [cat], other: [] });
  });

  it('requires both the query and the cell filters to match', () => {
    const filters: CellFilter[] = [{ type: 'exclude', x: 0, y: 0 }];

    expect(groupResults([cat, dog], 'cat', filters)).toEqual({ matching: [], other: [cat, dog] });
  });
});

describe('resultMatchesCellFilter', () => {
  const result = createResult({ word: 'cat', x: 1, y: 1 });

  it('matches without filters', () => {
    expect(resultMatchesCellFilter(result, [])).toBe(true);
  });

  it('rejects a result that covers an excluded cell', () => {
    expect(resultMatchesCellFilter(result, [{ type: 'exclude', x: 2, y: 1 }])).toBe(false);
  });

  it('accepts a result that avoids an excluded cell', () => {
    expect(resultMatchesCellFilter(result, [{ type: 'exclude', x: 9, y: 1 }])).toBe(true);
  });

  it('requires every included cell', () => {
    expect(
      resultMatchesCellFilter(result, [
        { type: 'include', x: 1, y: 1 },
        { type: 'include', x: 3, y: 1 },
      ]),
    ).toBe(true);
    expect(
      resultMatchesCellFilter(result, [
        { type: 'include', x: 1, y: 1 },
        { type: 'include', x: 9, y: 9 },
      ]),
    ).toBe(false);
  });

  it('compares both coordinates', () => {
    expect(resultMatchesCellFilter(result, [{ type: 'include', x: 1, y: 2 }])).toBe(false);
  });
});

describe('sortResults', () => {
  const short = createResult({ blanks: [0], collisions: ['ax'], id: 1, points: 30, word: 'it', x: 0, y: 3 });
  const long = createResult({ id: 2, points: 10, word: 'eagle', x: 0, y: 1 });

  it('is undefined for undefined results', () => {
    expect(sortResults(undefined, sort(ResultColumnId.Word), 'en-US', 'original')).toBeUndefined();
  });

  it('does not mutate its input', () => {
    const results = [short, long];

    sortResults(results, sort(ResultColumnId.Word), 'en-US', 'original');

    expect(results).toEqual([short, long]);
  });

  it.each([
    [ResultColumnId.BlanksCount, [long, short]],
    [ResultColumnId.ConsonantsCount, [short, long]],
    [ResultColumnId.Coordinates, [long, short]],
    [ResultColumnId.Points, [long, short]],
    [ResultColumnId.TilesCount, [short, long]],
    [ResultColumnId.VowelsCount, [short, long]],
    [ResultColumnId.Word, [long, short]],
    [ResultColumnId.WordsCount, [long, short]],
  ])('sorts by %s', (column, expected) => {
    expect(sortResults([short, long], sort(column), 'en-US', 'original')).toEqual(expected);
  });

  it('reverses for descending', () => {
    expect(
      sortResults([short, long], sort(ResultColumnId.Points, SortDirection.Descending), 'en-US', 'original'),
    ).toEqual([short, long]);
  });

  it('sorts coordinates in the active coordinates mode', () => {
    const first = createResult({ id: 1, x: 9, y: 0 });
    const second = createResult({ id: 2, x: 1, y: 1 });

    expect(sortResults([second, first], sort(ResultColumnId.Coordinates), 'en-US', 'alternative')).toEqual([
      first,
      second,
    ]);
  });
});

function sort(column: ResultColumnId, direction = SortDirection.Ascending) {
  return { column, direction };
}
