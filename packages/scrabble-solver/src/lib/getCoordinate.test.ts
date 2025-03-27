import { getCoordinate } from './getCoordinate';

describe('getCoordinate', () => {
  it.each([
    { index: 0, type: 'number' as const, expected: '1' },
    { index: 99, type: 'number' as const, expected: '100' },
  ])(`getCoordinate($index, "number") === "$expected"`, ({ index, type, expected }) => {
    expect(getCoordinate(index, type)).toEqual(expected);
  });

  it.each([
    { index: 0, type: 'letter' as const, expected: 'A' },
    { index: 25, type: 'letter' as const, expected: 'Z' },
    { index: 26, type: 'letter' as const, expected: 'AA' },
    { index: 27, type: 'letter' as const, expected: 'AB' },
    { index: 51, type: 'letter' as const, expected: 'AZ' },
    { index: 52, type: 'letter' as const, expected: 'BA' },
    { index: 53, type: 'letter' as const, expected: 'BB' },
  ])(`getCoordinate("$index", "letter") === "$expected"`, ({ index, type, expected }) => {
    expect(getCoordinate(index, type)).toEqual(expected);
  });
});
