import { NO_BONUS } from '@scrabble-solver/constants';
import { Cell, Config } from '@scrabble-solver/types';

const getCellsScore = (config: Config, cells: Cell[]): number => {
  const { multiplier, score } = cells.reduce(
    ({ multiplier, score }, cell: Cell): { multiplier: number; score: number } => {
      const bonus = config.getCellBonus(cell);
      const { characterMultiplier, wordMultiplier } = bonus && bonus.canApply(config, cell) ? bonus.value : NO_BONUS;
      const characterScore = cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character];

      return {
        multiplier: multiplier * wordMultiplier,
        score: score + characterScore * characterMultiplier,
      };
    },
    { multiplier: 1, score: 0 },
  );

  return score * multiplier;
};

export default getCellsScore;
