import { RemainingTile } from 'types';

export const getRemainingTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => {
    if (typeof count === 'undefined') {
      return sum;
    }

    return sum + count - usedCount;
  }, 0);
};
