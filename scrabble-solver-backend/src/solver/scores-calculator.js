class ScoresCalculator {
  constructor(config) {
    this.config = config;
  }

  calculate(pattern) {
    return this.calculatePatternsScore(pattern) + this.calculateBonusScore(pattern);
  }

  calculatePatternsScore(pattern) {
    return pattern
      .getCollisions()
      .concat([pattern])
      .reduce((patternsScore, pattern) => patternsScore + this.calculatePatternScore(pattern), 0);
  }

  calculateBonusScore(pattern) {
    const areAllTilesUsed = pattern.getNumberOfEmptyCells() === this.config.maximumNumberOfCharacters;
    return areAllTilesUsed ? this.config.allTilesBonusScore : 0;
  }

  calculatePatternScore(pattern) {
    const { multiplier, score } = pattern.cells.reduce((...params) => this.reduceCharacterScore(...params), {
      multiplier: 1,
      score: 0
    });
    return score * multiplier;
  }

  reduceCharacterScore({ multiplier, score }, cell) {
    const {
      tile: { character, isBlank }
    } = cell;
    const { wordMultiplier, characterMultiplier } = this.config.getCellBonusValue(cell);
    const characterScore = isBlank ? this.config.blankScore : this.config.pointsMap[character];
    return {
      multiplier: multiplier * wordMultiplier,
      score: score + characterScore * characterMultiplier
    };
  }
}

export default ScoresCalculator;
