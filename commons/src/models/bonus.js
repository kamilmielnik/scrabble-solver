class Bonus {
  constructor({ config, x, y, multiplier, score }) {
    this.config = config;
    this.x = x;
    this.y = y;
    this.multiplier = multiplier;
    this.score = score;
  }

  canApply(cell) {
    return this.matchesCellCoordinates(cell);
  }

  matchesCellCoordinates(cell) {
    return this.x === cell.x && this.y === cell.y;
  }

  getValue() {
    return {
      wordMultiplier: 1,
      characterMultiplier: 1
    };
  }

  getType() {
    throw new Error('Bonus was instantiated without a "type"');
  }

  toJson() {
    return {
      x: this.x,
      y: this.y,
      multiplier: this.multiplier,
      score: this.score,
      type: this.getType()
    };
  }
}

export default Bonus;
