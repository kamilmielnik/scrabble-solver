import { Cell } from '@scrabble-solver/types';

const generateEndIndices = (cells: Cell[], startIndex: number): number[] => {
  return Array(cells.length - startIndex - 1)
    .fill(0)
    .map((_, endIndex) => endIndex + startIndex + 1)
    .filter((endIndex) => endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile());
};

export default generateEndIndices;
