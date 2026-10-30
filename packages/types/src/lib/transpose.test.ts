import { describe, expect, it } from 'bun:test';

import { transpose } from './transpose';

describe('transpose', () => {
  it('swaps rows and columns of a square', () => {
    expect(
      transpose([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('turns a wide array into a tall one', () => {
    expect(transpose([[1, 2, 3]])).toEqual([[1], [2], [3]]);
  });

  it('turns a tall array into a wide one', () => {
    expect(transpose([[1], [2], [3]])).toEqual([[1, 2, 3]]);
  });

  it('keeps every value of a non-square array in place', () => {
    expect(
      transpose([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it('restores the original when applied twice', () => {
    const original = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];

    expect(transpose(transpose(original))).toEqual(original);
  });

  it('has nothing to return for rows without columns', () => {
    expect(transpose([[], []])).toEqual([]);
  });

  it('moves the elements themselves instead of copying them', () => {
    const element = {};

    expect(transpose([[element]])[0][0]).toBe(element);
  });

  it('gives every column its own array', () => {
    const transposed = transpose([
      [1, 2],
      [3, 4],
    ]);

    expect(transposed[0]).not.toBe(transposed[1]);
  });

  it('leaves the input unchanged', () => {
    const input = [
      [1, 2],
      [3, 4],
    ];

    transpose(input);

    expect(input).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
});
