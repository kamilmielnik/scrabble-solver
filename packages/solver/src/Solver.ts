import { Trie } from '@kamilmielnik/trie';
import { Board, Config, Result, Tile } from '@scrabble-solver/types';
import uniqBy from 'lodash/uniqBy';

import PatternsFiller from './PatternsFiller';
import PatternsGenerator from './PatternsGenerator';
import ScoresCalculator from './ScoresCalculator';

class Solver {
  private readonly patternsFiller: PatternsFiller;

  private readonly patternsGenerator: PatternsGenerator;

  private readonly scoresCalculator: ScoresCalculator;

  constructor(config: Config, trie: Trie) {
    this.patternsFiller = new PatternsFiller(config, trie);
    this.patternsGenerator = new PatternsGenerator(config);
    this.scoresCalculator = new ScoresCalculator(config);
  }

  public solve(board: Board, tiles: Tile[]): Result[] {
    const patterns = this.patternsGenerator
      .generate(board)
      .flatMap((pattern) => this.patternsFiller.fill(pattern, tiles));
    const uniquePatterns = uniqBy(patterns, (pattern) => JSON.stringify(pattern.toJson()));
    const results = uniquePatterns.map(
      (pattern, index) =>
        new Result({
          cells: pattern.cells,
          id: index,
          numberOfCollisions: pattern.getCollisions().length,
          points: this.scoresCalculator.calculate(pattern),
        }),
    );
    return results;
  }
}

export default Solver;
