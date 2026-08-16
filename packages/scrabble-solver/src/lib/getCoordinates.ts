import { type ShowCoordinates } from '@scrabble-solver/types';

import { getCoordinate } from './getCoordinate';

interface Parameters {
  isHorizontal: boolean;
  x: number;
  y: number;
}

export const getCoordinates = ({ isHorizontal, x, y }: Parameters, showCoordinates: ShowCoordinates): string => {
  const xCoordinate = getCoordinate(x, showCoordinates === 'original' ? 'letter' : 'number');
  const yCoordinate = getCoordinate(y, showCoordinates === 'original' ? 'number' : 'letter');

  return isHorizontal ? `${yCoordinate}${xCoordinate}` : `${xCoordinate}${yCoordinate}`;
};
