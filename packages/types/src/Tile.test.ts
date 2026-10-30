import { EMPTY_CELL } from '@scrabble-solver/constants';
import { describe, expect, it } from 'bun:test';

import { Tile } from './Tile';
import { type TileJson } from './TileJson';

describe('Tile', () => {
  it('is not blank unless told otherwise', () => {
    expect(new Tile({ character: 'a' }).isBlank).toBe(false);
    expect(new Tile({ character: 'a', isBlank: true }).isBlank).toBe(true);
  });

  describe('fromJson and toJson', () => {
    it.each([
      ['a regular tile', { character: 'a', isBlank: false }],
      ['a blank standing for a letter', { character: 'a', isBlank: true }],
      ['a two-character tile', { character: 'ch', isBlank: false }],
      ['a right-to-left letter', { character: 'پ', isBlank: false }],
    ])('round-trips %s exactly', (_name, json) => {
      expect(Tile.fromJson(json).toJson()).toStrictEqual(json);
    });

    it('survives serialization to text', () => {
      const tile = new Tile({ character: 'ż', isBlank: true });

      const decoded = JSON.parse(JSON.stringify(tile.toJson())) as TileJson;

      expect(Tile.fromJson(decoded).equals(tile)).toBe(true);
    });

    it('reads a missing tile as the shared null tile', () => {
      expect(Tile.fromJson(null)).toBe(Tile.Null);
    });

    it('builds a real tile instance', () => {
      expect(Tile.fromJson({ character: 'a', isBlank: false })).toBeInstanceOf(Tile);
    });
  });

  it('clones into an independent equal tile', () => {
    const tile = new Tile({ character: 'a', isBlank: true });
    const clone = tile.clone();

    clone.character = 'b';
    clone.isBlank = false;

    expect(clone).not.toBe(tile);
    expect(tile.toJson()).toStrictEqual({ character: 'a', isBlank: true });
    expect(tile.clone().equals(tile)).toBe(true);
  });

  describe('equals', () => {
    const tile = new Tile({ character: 'a' });

    it('accepts the same character and blank flag', () => {
      expect(tile.equals(new Tile({ character: 'a' }))).toBe(true);
    });

    it('rejects a different character', () => {
      expect(tile.equals(new Tile({ character: 'b' }))).toBe(false);
    });

    it('rejects a blank standing for the same letter', () => {
      expect(tile.equals(new Tile({ character: 'a', isBlank: true }))).toBe(false);
    });

    it('rejects the null tile', () => {
      expect(tile.equals(Tile.Null)).toBe(false);
    });
  });

  it('prints its character', () => {
    expect(String(new Tile({ character: 'a' }))).toBe('a');
    expect(String(new Tile({ character: 'rr', isBlank: true }))).toBe('rr');
  });
});

describe('Tile.Null', () => {
  it('shows an empty cell and is not a blank', () => {
    expect(Tile.Null.character).toBe(EMPTY_CELL);
    expect(Tile.Null.isBlank).toBe(false);
    expect(String(Tile.Null)).toBe(EMPTY_CELL);
  });

  it('serializes to null, which reads back as itself', () => {
    expect(Tile.Null.toJson()).toBeNull();
    expect(Tile.fromJson(Tile.Null.toJson())).toBe(Tile.Null);
  });

  it('keeps its identity when cloned', () => {
    expect(Tile.Null.clone()).toBe(Tile.Null);
  });

  it('equals only itself', () => {
    expect(Tile.Null.equals(Tile.Null)).toBe(true);
    expect(Tile.Null.equals(new Tile({ character: 'a' }))).toBe(false);
  });

  it('cannot be mutated', () => {
    expect(Object.isFrozen(Tile.Null)).toBe(true);
    expect(() => {
      Tile.Null.character = 'a';
    }).toThrow(TypeError);
  });

  it.todo('agrees in both directions on whether it equals a non-blank tile holding a space');
});
