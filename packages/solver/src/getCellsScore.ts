import { NO_BONUS } from '@scrabble-solver/constants';
import { Cell, Config } from '@scrabble-solver/types';

export const getCellsScore = (config: Config, cells: Cell[]): number => {
  const total = cells.reduce(
    ({ multiplier, score }, cell: Cell): { multiplier: number; score: number } => {
      const bonus = config.getCellBonus(cell);
      const { characterMultiplier, wordMultiplier } = bonus && bonus.canApply(config, cell) ? bonus.value : NO_BONUS;
      const characterScore = config.pointsMap[cell.tile.character] || 0;
      const tileScore = cell.tile.isBlank ? config.blankScore : characterScore;

      return {
        multiplier: multiplier * wordMultiplier,
        score: score + tileScore * characterMultiplier,
      };
    },
    { multiplier: 1, score: 0 },
  );

  return total.score * total.multiplier;
};
