import uniqBy from 'lodash/uniqBy';
import { Result } from 'scrabble-solver-commons/models';
import PatternsFiller from './patterns-filler';
import PatternsGenerator from './patterns-generator';
import ScoresCalculator from './scores-calculator';

class Solver {
  constructor(config, collection) {
    this.patternsFiller = new PatternsFiller(config, collection);
    this.patternsGenerator = new PatternsGenerator(config);
    this.scoresCalculator = new ScoresCalculator(config);
  }

  solve(board, tiles) {
    const { horizontal, vertical } = this.patternsGenerator.generate(board);
    const patterns = [...horizontal, ...vertical].reduce(
      (filledPatterns, pattern) => filledPatterns.concat(this.patternsFiller.fill(pattern, tiles)),
      []
    );
    const uniquePatterns = uniqBy(patterns, (pattern) => JSON.stringify(pattern.toJson()));
    const results = uniquePatterns.map(
      (pattern, index) =>
        new Result({
          id: index,
          points: this.scoresCalculator.calculate(pattern),
          cells: pattern.cells,
          numberOfCollisions: pattern.getCollisions().length
        })
    );
    return results;
  }
}

export default Solver;
