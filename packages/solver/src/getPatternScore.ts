import { Config, Pattern } from '@scrabble-solver/types';

import { getCellsScore } from './getCellsScore';

export const getPatternScore = (config: Config, pattern: Pattern) => {
  const areAllTilesUsed = pattern.getEmptyCellsCount() === config.rackSize;
  const bonusScore = areAllTilesUsed ? config.bingoScore : 0;
  const score = pattern
    .getCollisions()
    .reduce((sum, collision) => sum + getCellsScore(config, collision.cells), getCellsScore(config, pattern.cells));

  return score + bonusScore;
};
