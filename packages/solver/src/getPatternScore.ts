import { Config, isMultiplierBingo, isScoreBingo, Pattern } from '@scrabble-solver/types';

import { getCellsScore } from './getCellsScore';

export const getPatternScore = (config: Config, pattern: Pattern) => {
  const areAllTilesUsed = pattern.getEmptyCellsCount() === config.rackSize;
  const baseScore = getCellsScore(config, pattern.cells);
  const collisionsScore = pattern
    .getCollisions()
    .reduce((sum, collision) => sum + getCellsScore(config, collision.cells), 0);

  if (areAllTilesUsed) {
    if (isScoreBingo(config.bingo)) {
      return baseScore + collisionsScore + config.bingo.score;
    }

    if (isMultiplierBingo(config.bingo)) {
      return baseScore * config.bingo.multiplier + collisionsScore;
    }
  }

  return baseScore + collisionsScore;
};
