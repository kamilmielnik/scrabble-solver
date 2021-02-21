import { RemainingTile } from 'types';

const getTotalRemainingTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

export default getTotalRemainingTilesCount;
