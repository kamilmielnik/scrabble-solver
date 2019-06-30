class ScoresCalculator {
  constructor(config) {
    this.config = config;
  }

  calculate(pattern) {
    return this.calculatePatternScoreWithCollisions(pattern) + this.calculateBonusScore(pattern);
  }

  calculateBonusScore(pattern) {
    const areAllTilesUsed = pattern.getNumberOfEmptyCells() === this.config.maximumNumberOfCharacters;
    return areAllTilesUsed ? this.config.allTilesBonusScore : 0;
  }

  calculatePatternScoreWithCollisions(pattern) {
    return pattern
      .getCollisions()
      .reduce(
        (patternsScore, collisionPattern) => patternsScore + this.calculatePatternScore(collisionPattern),
        this.calculatePatternScore(pattern)
      );
  }

  calculatePatternScore(pattern) {
    const { multiplier, score } = pattern.cells.reduce(this.reduceCellScore, {
      multiplier: 1,
      score: 0
    });
    return score * multiplier;
  }

  reduceCellScore = ({ multiplier, score }, cell) => {
    const { wordMultiplier, characterMultiplier } = this.config.getCellBonusValue(cell);
    const characterScore = cell.tile.isBlank ? this.config.blankScore : this.config.pointsMap[cell.tile.character];
    return {
      multiplier: multiplier * wordMultiplier,
      score: score + characterScore * characterMultiplier
    };
  };
}

export default ScoresCalculator;
