/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { type ComparatorFactory, SortDirection } from '../types';

import { createComparator } from './createComparator';
import { createCoordinatesComparator } from './createCoordinatesComparator';
import { createKeyComparator } from './createKeyComparator';
import { createSortComparator } from './createSortComparator';
import { createStringComparator } from './createStringComparator';
import { numberComparator } from './numberComparator';
import { reverseComparator } from './reverseComparator';

describe('numberComparator', () => {
  it('sorts ascending', () => {
    expect([3, 1, 2].sort(numberComparator)).toEqual([1, 2, 3]);
  });
});

describe('reverseComparator', () => {
  it('inverts order and keeps ties', () => {
    const reversed = reverseComparator(numberComparator);

    expect([1, 3, 2].sort(reversed)).toEqual([3, 2, 1]);
    expect(Math.abs(reversed(1, 1))).toBe(0);
  });
});

describe('createStringComparator', () => {
  it('sorts by locale rules, not code points', () => {
    expect(['ą', 'b', 'a'].sort(createStringComparator('pl-PL'))).toEqual(['a', 'ą', 'b']);
  });
});

describe('createComparator', () => {
  const comparator = createComparator<unknown>('en-US');

  it('compares strings and numbers', () => {
    expect(comparator('a', 'b')).toBeLessThan(0);
    expect(comparator(2, 1)).toBeGreaterThan(0);
  });

  it('treats mixed or other types as equal', () => {
    expect(comparator('a', 1)).toBe(0);
    expect(comparator(null, null)).toBe(0);
  });
});

describe('createKeyComparator', () => {
  it('compares a string key by locale', () => {
    const comparator = createKeyComparator<{ word: string }>('word', 'pl-PL');

    expect([{ word: 'b' }, { word: 'ą' }].sort(comparator)).toEqual([{ word: 'ą' }, { word: 'b' }]);
  });

  it('compares a number key', () => {
    const comparator = createKeyComparator<{ points: number }>('points', 'en-US');

    expect([{ points: 2 }, { points: 1 }].sort(comparator)).toEqual([{ points: 1 }, { points: 2 }]);
  });

  it('treats mixed value types as equal', () => {
    const comparator = createKeyComparator<{ value: number | string }>('value', 'en-US');

    expect(comparator({ value: 1 }, { value: 'a' })).toBe(0);
  });
});

describe('createCoordinatesComparator', () => {
  it('compares the coordinates text of each item in the active mode', () => {
    const modes: string[] = [];
    const comparator = createCoordinatesComparator<string>({
      getItemCoordinates: (item, mode) => {
        modes.push(mode);
        return item;
      },
      locale: 'en-US',
      showCoordinates: 'alternative',
    });

    expect(comparator('A1', 'B1')).toBeLessThan(0);
    expect(modes).toEqual(['alternative', 'alternative']);
  });
});

describe('createSortComparator', () => {
  const comparators: Record<'points', ComparatorFactory<{ points: number }>> = {
    points: (locale) => createKeyComparator('points', locale),
  };
  const items = [{ points: 1 }, { points: 2 }];

  it('sorts ascending as is', () => {
    const comparator = createSortComparator({
      comparators,
      locale: 'en-US',
      showCoordinates: 'original',
      sort: { column: 'points', direction: SortDirection.Ascending },
    });

    expect([...items].reverse().sort(comparator)).toEqual(items);
  });

  it('reverses descending', () => {
    const comparator = createSortComparator({
      comparators,
      locale: 'en-US',
      showCoordinates: 'original',
      sort: { column: 'points', direction: SortDirection.Descending },
    });

    expect([...items].sort(comparator)).toEqual([...items].reverse());
  });

  it('passes locale and coordinates mode to the column factory', () => {
    const calls: unknown[][] = [];

    createSortComparator({
      comparators: {
        results: (...parameters) => {
          calls.push(parameters);
          return () => 0;
        },
      },
      locale: 'pl-PL',
      showCoordinates: 'alternative',
      sort: { column: 'results', direction: SortDirection.Ascending },
    });

    expect(calls).toEqual([['pl-PL', 'alternative']]);
  });
});
