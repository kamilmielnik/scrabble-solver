import { Result, ShowCoordinates } from '@scrabble-solver/types';

import getCoordinate from './getCoordinate';

const getCoordinates = (result: Result, showCoordinates: ShowCoordinates): string => {
  if (showCoordinates === 'hidden') {
    return '';
  }

  const firstCell = result.cells[0];
  const isHorizontal = firstCell.x !== result.cells[1].x;
  const x = getCoordinate(firstCell.x, showCoordinates === 'original' ? 'letter' : 'number');
  const y = getCoordinate(firstCell.y, showCoordinates === 'original' ? 'number' : 'letter');

  return isHorizontal ? `${y}${x}` : `${x}${y}`;
};

export default getCoordinates;
