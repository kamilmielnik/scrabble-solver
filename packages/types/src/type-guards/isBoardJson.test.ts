import { describe, expect, it } from 'bun:test';

import { Board } from '../Board';

import { isBoardJson } from './isBoardJson';

describe('isBoardJson', () => {
  const cell = { isEmpty: true, tile: null, x: 0, y: 0 };

  it('accepts a board of cells', () => {
    expect(
      isBoardJson([
        [cell, cell],
        [cell, cell],
      ]),
    ).toBe(true);
  });

  it('accepts an empty board', () => {
    expect(isBoardJson([])).toBe(true);
  });

  it('rejects a non-array', () => {
    expect(isBoardJson({ rows: [] })).toBe(false);
  });

  it('rejects rows that are not arrays', () => {
    expect(isBoardJson([1, 2, 3])).toBe(false);
    expect(isBoardJson([[cell], 'row'])).toBe(false);
  });

  it('rejects rows holding something other than cells', () => {
    expect(isBoardJson([[cell, { x: 1, y: 0 }]])).toBe(false);
  });

  it('accepts what a board serializes to', () => {
    expect(isBoardJson(Board.fromStringArray(['ab', ' c']).toJson())).toBe(true);
  });

  it('accepts a cell holding a tile', () => {
    expect(isBoardJson([[{ isEmpty: false, tile: { character: 'a', isBlank: true }, x: 0, y: 0 }]])).toBe(true);
  });

  it('accepts a row without cells', () => {
    expect(isBoardJson([[]])).toBe(true);
  });

  it('leaves the board dimensions for the API to compare against the config', () => {
    expect(isBoardJson([[cell], [cell, cell]])).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 5],
    ['NaN', Number.NaN],
    ['text', '[[]]'],
    ['an array-like object', { 0: [cell], length: 1 }],
  ])('rejects %s', (_name, value) => {
    expect(isBoardJson(value)).toBe(false);
  });

  it('rejects a null row', () => {
    expect(isBoardJson([[cell], null])).toBe(false);
  });

  it('rejects a null cell', () => {
    expect(isBoardJson([[cell, null]])).toBe(false);
  });

  it('rejects a bad cell in a row after the first', () => {
    expect(isBoardJson([[cell], [{ ...cell, x: '1' }]])).toBe(false);
  });
});
