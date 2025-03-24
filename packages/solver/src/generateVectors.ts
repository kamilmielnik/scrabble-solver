import { Cell } from '@scrabble-solver/types';

interface Parameters {
  getNthVector: (index: number) => Cell[];
  vectorsCount: number;
}

export const generateVectors = ({ getNthVector, vectorsCount }: Parameters): Cell[][] => {
  return Array.from({ length: vectorsCount }, (_, index) => getNthVector(index));
};
