import { Cell } from '@scrabble-solver/types';

const generateVectors = ({
  getNthVector,
  vectorsCount,
}: {
  getNthVector: (index: number) => Cell[];
  vectorsCount: number;
}): Cell[][] => {
  return Array(vectorsCount)
    .fill(0)
    .map((_, index) => getNthVector(index));
};

export default generateVectors;
