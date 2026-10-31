import { describe, expect, it } from 'bun:test';

import { type ResultJson } from '../ResultJson';

import { getPlacedCell } from './getPlacedCell';

describe('getPlacedCell', () => {
  const json: ResultJson = {
    blankIndices: [1],
    id: 0,
    isHorizontal: true,
    points: 0,
    tiles: ['a', 'ch', 'c'],
    x: 0,
    y: 0,
  };

  it('picks the tile at the placed index', () => {
    expect(getPlacedCell(json, 2, 0, 0).tile.character).toBe('c');
  });

  it('keeps a two-character tile whole', () => {
    expect(getPlacedCell(json, 1, 0, 0).tile.character).toBe('ch');
  });

  it('uses the given coordinates rather than the start of the word', () => {
    const cell = getPlacedCell(json, 0, 4, 9);

    expect(cell.x).toBe(4);
    expect(cell.y).toBe(9);
  });

  it('leaves the cell empty, because the tile is not on the board yet', () => {
    const cell = getPlacedCell(json, 0, 0, 0);

    expect(cell.isEmpty).toBe(true);
    expect(cell.isCandidate()).toBe(true);
  });

  it('marks a tile listed in the blank indices', () => {
    expect(getPlacedCell(json, 1, 0, 0).tile.isBlank).toBe(true);
  });

  it('does not mark a tile missing from the blank indices', () => {
    expect(getPlacedCell(json, 0, 0, 0).tile.isBlank).toBe(false);
  });
});
