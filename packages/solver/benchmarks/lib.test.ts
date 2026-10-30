import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { formatBlanksCount, formatDuration, formatInteger, getMeasurement, median, unique } from './lib';
import { type Measurement } from './types';

describe('getMeasurement', () => {
  const measurements = [
    createMeasurement('Polish', 0),
    createMeasurement('Polish', 1),
    createMeasurement('English', 1),
  ];

  it('finds the measurement matching both the label and the blanks count', () => {
    expect(getMeasurement(measurements, 'Polish', 1)).toBe(measurements[1]);
    expect(getMeasurement(measurements, 'English', 1)).toBe(measurements[2]);
  });

  it('throws naming what is missing when only the label matches', () => {
    expect(() => getMeasurement(measurements, 'English', 0)).toThrow('Missing measurement for "English" with 0 blanks');
  });

  it('throws when only the blanks count matches', () => {
    expect(() => getMeasurement(measurements, 'German', 1)).toThrow('Missing measurement for "German" with 1 blanks');
  });
});

describe('median', () => {
  it('returns the middle value of an odd number of values', () => {
    expect(median([1, 2, 30])).toBe(2);
  });

  it('averages the two middle values of an even number of values', () => {
    expect(median([1, 2, 3, 40])).toBe(2.5);
  });

  it('returns the only value', () => {
    expect(median([7])).toBe(7);
  });

  it('sorts numerically, not lexicographically', () => {
    expect(median([10, 2, 1])).toBe(2);
  });

  it('does not reorder the array it is given', () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});

describe('formatDuration', () => {
  it('rounds durations under a second to whole milliseconds', () => {
    expect(formatDuration(0.4)).toBe('0 ms');
    expect(formatDuration(1.5)).toBe('2 ms');
    expect(formatDuration(999)).toBe('999 ms');
  });

  it('switches to seconds with one decimal at exactly one second', () => {
    expect(formatDuration(1000)).toBe('1.0 s');
    expect(formatDuration(1250)).toBe('1.3 s');
  });

  it('switches to seconds for durations that round up to one second', () => {
    expect(formatDuration(999.4)).toBe('999 ms');
    expect(formatDuration(999.6)).toBe('1.0 s');
  });
});

describe('formatBlanksCount', () => {
  it('uses the singular only for one blank', () => {
    expect(formatBlanksCount(0)).toBe('0 blanks');
    expect(formatBlanksCount(1)).toBe('1 blank');
    expect(formatBlanksCount(2)).toBe('2 blanks');
  });
});

describe('formatInteger', () => {
  it('groups thousands with commas', () => {
    expect(formatInteger(999)).toBe('999');
    expect(formatInteger(1559)).toBe('1,559');
    expect(formatInteger(1234567)).toBe('1,234,567');
  });
});

describe('unique', () => {
  it('drops repeated values and keeps first-seen order', () => {
    expect(unique([2, 1, 2, 3, 1])).toEqual([2, 1, 3]);
  });

  it('returns an empty array for no values', () => {
    expect(unique([])).toEqual([]);
  });
});

function createMeasurement(label: string, blanksCount: number): Measurement {
  return { blanksCount, durations: [1], label, locale: Locale.EN_US, resultsCount: 1 };
}
