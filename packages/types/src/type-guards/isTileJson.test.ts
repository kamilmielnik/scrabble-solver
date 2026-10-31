import { describe, expect, it } from 'bun:test';

import { Tile } from '../Tile';

import { isTileJson } from './isTileJson';

describe('isTileJson', () => {
  it.each([
    ['a regular tile', { character: 'a', isBlank: false }],
    ['a blank', { character: 'a', isBlank: true }],
    ['a two-character tile', { character: 'ch', isBlank: false }],
    ['a blank still on the rack', { character: ' ', isBlank: true }],
    ['extra fields', { character: 'a', extra: 1, isBlank: false }],
    ['what a tile serializes to', new Tile({ character: 'a' }).toJson()],
  ])('accepts %s', (_name, value) => {
    expect(isTileJson(value)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 1],
    ['NaN', Number.NaN],
    ['text', 'a'],
    ['an empty object', {}],
    ['an array', ['a', false]],
    ['an empty array', []],
    ['a missing character', { isBlank: false }],
    ['a missing blank flag', { character: 'a' }],
    ['a numeric character', { character: 1, isBlank: false }],
    ['a null character', { character: null, isBlank: false }],
    ['a text blank flag', { character: 'a', isBlank: 'false' }],
    ['a numeric blank flag', { character: 'a', isBlank: 0 }],
    ['a null blank flag', { character: 'a', isBlank: null }],
  ])('rejects %s', (_name, value) => {
    expect(isTileJson(value)).toBe(false);
  });

  it('rejects the null tile, which serializes to null', () => {
    expect(isTileJson(Tile.Null.toJson())).toBe(false);
  });
});
