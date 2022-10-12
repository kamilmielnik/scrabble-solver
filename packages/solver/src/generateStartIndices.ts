import { Cell } from '@scrabble-solver/types';

const generateStartIndices = (cells: Cell[]): number[] => {
  return Array(cells.length - 1)
    .fill(0)
    .map((_, startIndex) => startIndex)
    .filter((startIndex) => startIndex === 0 || !cells[startIndex - 1].hasTile());
};

export default generateStartIndices;
