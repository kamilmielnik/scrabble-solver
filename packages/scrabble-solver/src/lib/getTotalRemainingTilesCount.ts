import { RemainingTile } from 'types';

export const getTotalRemainingTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => {
    if (typeof count === 'undefined') {
      return sum;
    }

    return sum + count;
  }, 0);
};
