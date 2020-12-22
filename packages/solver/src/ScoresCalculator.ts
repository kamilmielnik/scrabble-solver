import { Cell, Config, Pattern } from '@scrabble-solver/models';

class ScoresCalculator {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public calculate(pattern: Pattern): number {
    return this.calculatePatternScoreWithCollisions(pattern) + this.calculateBonusScore(pattern);
  }

  public calculateBonusScore(pattern: Pattern): number {
    const areAllTilesUsed = pattern.getNumberOfEmptyCells() === this.config.maximumNumberOfCharacters;
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
    const { characterMultiplier, wordMultiplier } = this.config.getCellBonusValue(cell);
    const characterScore = cell.tile.isBlank ? this.config.blankScore : this.config.pointsMap[cell.tile.character];

    return {
      multiplier: multiplier * wordMultiplier,
      score: score + characterScore * characterMultiplier,
    };
  };
}

export default ScoresCalculator;
