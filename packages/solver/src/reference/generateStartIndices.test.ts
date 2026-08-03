import { type Cell } from '@scrabble-solver/types';

import { generateStartIndices } from './generateStartIndices';

describe('generateStartIndices', () => {
  const emptyCell: Cell = { hasTile: () => false } as Cell;
  const filledCell: Cell = { hasTile: () => true } as Cell;

  it('returns empty array when no cells given', () => {
    const cells: Cell[] = [];
    expect(generateStartIndices(cells).length).toBe(0);
  });

  it('finds indices where a new word can start', () => {
    const cells = [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell];
    const startIndices = generateStartIndices(cells);
    expect(startIndices).toEqual([0, 3, 4]);
  });
});
