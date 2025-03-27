import { Config, isMultiplierBingo, isScoreBingo, Pattern } from '@scrabble-solver/types';

import { getCellsScore } from './getCellsScore';

export const getPatternScore = (config: Config, pattern: Pattern) => {
  const areAllTilesUsed = pattern.getEmptyCellsCount() === config.rackSize;
  const score = pattern
    .getCollisions()
    .reduce((sum, collision) => sum + getCellsScore(config, collision.cells), getCellsScore(config, pattern.cells));

  if (areAllTilesUsed) {
    if (isScoreBingo(config.bingo)) {
      return score + config.bingo.score;
    }

    if (isMultiplierBingo(config.bingo)) {
      return score * config.bingo.multiplier;
    }
  }

  return score;
};
