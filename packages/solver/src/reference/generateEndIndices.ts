import { type Cell } from '@scrabble-solver/types';

export const generateEndIndices = (cells: Cell[], startIndex: number): number[] => {
  if (cells.length === 0) {
    return [];
  }

  const endIndices: number[] = [];

  for (let endIndex = startIndex + 1; endIndex < cells.length - 1; ++endIndex) {
    if (!cells[endIndex + 1].hasTile()) {
      endIndices.push(endIndex);
    }
  }

  endIndices.push(cells.length - 1);

  return endIndices;
};
