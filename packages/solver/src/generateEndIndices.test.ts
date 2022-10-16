import { Cell } from '@scrabble-solver/types';

import generateEndIndices from './generateEndIndices';

describe('generateEndIndices', () => {
  const emptyCell: Cell = { hasTile: () => false } as Cell;
  const filledCell: Cell = { hasTile: () => true } as Cell;

  it('returns empty array when no cells given', () => {
    const cells: Cell[] = [];
    expect(generateEndIndices(cells, 0).length).toBe(0);
  });

  it('finds indices where a new word can end - XXOOOX', () => {
    const cells = [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell];
    expect(generateEndIndices(cells, 3)).toEqual([5]);
  });

  it('finds indices where a new word can end - XXOOOXO', () => {
    const cells = [filledCell, filledCell, emptyCell, emptyCell, emptyCell, filledCell, emptyCell];
    expect(generateEndIndices(cells, 3)).toEqual([5, 6]);
  });
});
