import { EMPTY_CELL } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Cell } from './Cell';
import { type CellJson } from './CellJson';
import { Tile } from './Tile';

const TILE = new Tile({ character: 'a' });

describe('Cell', () => {
  it('starts empty and without a tile', () => {
    const cell = new Cell({ x: 3, y: 4 });

    expect(cell.isEmpty).toBe(true);
    expect(cell.tile).toBe(Tile.Null);
    expect(cell.x).toBe(3);
    expect(cell.y).toBe(4);
  });

  describe('fill states', () => {
    it.each([
      ['an untouched cell', true, Tile.Null, { hasTile: false, isCandidate: false, isFilled: false }],
      ['a tile on the board', false, TILE, { hasTile: true, isCandidate: false, isFilled: true }],
      ['a tile being previewed', true, TILE, { hasTile: true, isCandidate: true, isFilled: false }],
      ['an occupied cell without a tile', false, Tile.Null, { hasTile: false, isCandidate: false, isFilled: false }],
    ])('classifies %s', (_name, isEmpty, tile, expected) => {
      const cell = new Cell({ isEmpty, tile, x: 0, y: 0 });

      expect({
        hasTile: cell.hasTile(),
        isCandidate: cell.isCandidate(),
        isFilled: cell.isFilled(),
      }).toEqual(expected);
    });
  });

  describe('fromJson and toJson', () => {
    it.each([
      ['an empty cell', { isEmpty: true, tile: null, x: 0, y: 14 }],
      ['a filled cell', { isEmpty: false, tile: { character: 'a', isBlank: false }, x: 7, y: 7 }],
      ['a filled blank', { isEmpty: false, tile: { character: 'a', isBlank: true }, x: 1, y: 2 }],
      ['a candidate', { isEmpty: true, tile: { character: 'ch', isBlank: false }, x: 2, y: 1 }],
    ])('round-trips %s exactly', (_name, json) => {
      expect(Cell.fromJson(json).toJson()).toStrictEqual(json);
    });

    it('survives serialization to text without gaining a tile', () => {
      const cell = new Cell({ x: 1, y: 1 });
      const decoded = Cell.fromJson(JSON.parse(JSON.stringify(cell.toJson())) as CellJson);

      expect(decoded.hasTile()).toBe(false);
      expect(decoded.equals(cell)).toBe(true);
    });

    it('keeps the shared null tile for a missing tile', () => {
      expect(Cell.fromJson({ isEmpty: true, tile: null, x: 0, y: 0 }).tile).toBe(Tile.Null);
    });
  });

  describe('clone', () => {
    it('copies the tile, so changing the copy leaves the original alone', () => {
      const cell = new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 1, y: 2 });
      const clone = cell.clone();

      clone.tile.character = 'b';

      expect(clone).not.toBe(cell);
      expect(cell.tile.character).toBe('a');
    });

    it('keeps every field', () => {
      const cell = new Cell({ isEmpty: true, tile: new Tile({ character: 'a', isBlank: true }), x: 1, y: 2 });

      expect(cell.clone().equals(cell)).toBe(true);
    });

    it('stays without a tile when it had none', () => {
      expect(new Cell({ x: 0, y: 0 }).clone().hasTile()).toBe(false);
    });
  });

  describe('equals', () => {
    const tile = new Tile({ character: 'a' });
    const cell = new Cell({ isEmpty: false, tile, x: 1, y: 2 });

    it('accepts a cell with the same coordinates, state and tile', () => {
      expect(cell.equals(new Cell({ isEmpty: false, tile: tile.clone(), x: 1, y: 2 }))).toBe(true);
    });

    it.each([
      ['column', new Cell({ isEmpty: false, tile, x: 9, y: 2 })],
      ['row', new Cell({ isEmpty: false, tile, x: 1, y: 9 })],
      ['empty state', new Cell({ isEmpty: true, tile, x: 1, y: 2 })],
      ['tile', new Cell({ isEmpty: false, tile: new Tile({ character: 'b' }), x: 1, y: 2 })],
      ['blank flag', new Cell({ isEmpty: false, tile: new Tile({ character: 'a', isBlank: true }), x: 1, y: 2 })],
    ])('rejects a cell with a different %s', (_name, other) => {
      expect(cell.equals(other)).toBe(false);
    });
  });

  it('prints its tile', () => {
    expect(String(new Cell({ tile: new Tile({ character: 'll' }), x: 0, y: 0 }))).toBe('ll');
    expect(String(new Cell({ x: 0, y: 0 }))).toBe(EMPTY_CELL);
  });
});
