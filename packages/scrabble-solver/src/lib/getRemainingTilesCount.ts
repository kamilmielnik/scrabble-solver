import { RemainingTile } from 'types';

const getRemainingTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => sum + count - usedCount, 0);
};

export default getRemainingTilesCount;
