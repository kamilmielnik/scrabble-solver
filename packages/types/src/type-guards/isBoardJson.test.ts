import { describe, expect, it } from 'bun:test';

import { isBoardJson } from './isBoardJson';

describe('isBoardJson', () => {
  const cell = { isEmpty: true, tile: null, x: 0, y: 0 };

  it('accepts a board of cells', () => {
    expect(isBoardJson([[cell, cell], [cell, cell]])).toBe(true);
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
});
