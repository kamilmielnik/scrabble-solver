import { NO_BONUS } from '@scrabble-solver/constants';
import { Cell, Config, Pattern } from '@scrabble-solver/types';

class ScoresCalculator {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public calculate(pattern: Pattern): number {
    return this.calculatePatternScoreWithCollisions(pattern) + this.calculateBonusScore(pattern);
  }

  public calculateBonusScore(pattern: Pattern): number {
    const areAllTilesUsed = pattern.getEmptyCellsCount() === this.config.maximumCharactersCount;
    return areAllTilesUsed ? this.config.allTilesBonusScore : 0;
  }

  public calculatePatternScoreWithCollisions(pattern: Pattern): number {
    return pattern
      .getCollisions()
      .reduce(
        (patternsScore, collisionPattern) => patternsScore + this.calculatePatternScore(collisionPattern),
        this.calculatePatternScore(pattern),
      );
  }

  public calculatePatternScore(pattern: Pattern): number {
    const { multiplier, score } = pattern.cells.reduce(this.reduceCellScore, {
      multiplier: 1,
      score: 0,
    });
    return score * multiplier;
  }

  public reduceCellScore = (
    { multiplier, score }: { multiplier: number; score: number },
    cell: Cell,
  ): { multiplier: number; score: number } => {
    const bonus = this.config.getCellBonus(cell);
    const { characterMultiplier, wordMultiplier } = bonus && bonus.canApply(this.config, cell) ? bonus.value : NO_BONUS;
    const characterScore = cell.tile.isBlank ? this.config.blankScore : this.config.pointsMap[cell.tile.character];

    return {
      multiplier: multiplier * wordMultiplier,
      score: score + characterScore * characterMultiplier,
    };
  };
}

export default ScoresCalculator;
