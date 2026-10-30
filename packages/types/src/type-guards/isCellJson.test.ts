import { describe, expect, it } from 'bun:test';

import { Cell } from '../Cell';
import { Tile } from '../Tile';

import { isCellJson } from './isCellJson';

describe('isCellJson', () => {
  const cell = { isEmpty: true, tile: null, x: 0, y: 0 };

  it.each([
    ['an empty cell', cell],
    ['a cell with a tile', { isEmpty: false, tile: { character: 'a', isBlank: false }, x: 1, y: 2 }],
    ['a candidate', { isEmpty: true, tile: { character: 'a', isBlank: false }, x: 1, y: 2 }],
    ['extra fields', { ...cell, extra: 1 }],
    ['what a cell serializes to', new Cell({ tile: new Tile({ character: 'a' }), x: 0, y: 0 }).toJson()],
  ])('accepts %s', (_name, value) => {
    expect(isCellJson(value)).toBe(true);
  });

  it('checks the type of coordinates only, leaving their range for the API to compare against the config', () => {
    expect(isCellJson({ ...cell, x: -1 })).toBe(true);
    expect(isCellJson({ ...cell, y: 1.5 })).toBe(true);
    expect(isCellJson({ ...cell, x: Number.POSITIVE_INFINITY })).toBe(true);
    expect(isCellJson({ ...cell, y: Number.NaN })).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 1],
    ['NaN', Number.NaN],
    ['text', 'cell'],
    ['an empty object', {}],
    ['an empty array', []],
    ['an array of the field values', [true, null, 0, 0]],
    ['a missing empty flag', { tile: null, x: 0, y: 0 }],
    ['a text empty flag', { ...cell, isEmpty: 'true' }],
    ['a null empty flag', { ...cell, isEmpty: null }],
    ['a missing tile', { isEmpty: true, x: 0, y: 0 }],
    ['an undefined tile', { ...cell, tile: undefined }],
    ['a malformed tile', { ...cell, tile: { character: 'a' } }],
    ['a text tile', { ...cell, tile: 'a' }],
    ['a missing column', { isEmpty: true, tile: null, y: 0 }],
    ['a text column', { ...cell, x: '0' }],
    ['a null column', { ...cell, x: null }],
    ['a missing row', { isEmpty: true, tile: null, x: 0 }],
    ['a text row', { ...cell, y: '0' }],
    ['a null row', { ...cell, y: null }],
  ])('rejects %s', (_name, value) => {
    expect(isCellJson(value)).toBe(false);
  });
});
