import { type Cell } from '@scrabble-solver/types';

export const generateStartIndices = (cells: Cell[]): number[] => {
  if (cells.length === 0) {
    return [];
  }

  const startIndices: number[] = [0];

  for (let startIndex = 1; startIndex < cells.length - 1; ++startIndex) {
    if (!cells[startIndex - 1].hasTile()) {
      startIndices.push(startIndex);
    }
  }

  return startIndices;
};
