import { Trie } from '@kamilmielnik/trie';
import { Board, Config, Result, Tile } from '@scrabble-solver/types';

import getPatternScore from './getPatternScore';
import getUniquePatterns from './getUniquePatterns';
import PatternsFiller from './PatternsFiller';
import PatternsGenerator from './PatternsGenerator';

class Solver {
  private readonly config: Config;

  private readonly patternsFiller: PatternsFiller;

  private readonly patternsGenerator: PatternsGenerator;

  constructor(config: Config, trie: Trie) {
    this.config = config;
    this.patternsFiller = new PatternsFiller(config, trie);
    this.patternsGenerator = new PatternsGenerator(config);
  }

  public solve(board: Board, tiles: Tile[]): Result[] {
    const patterns = this.patternsGenerator.generate(board);
    const filledPatterns = patterns.flatMap((pattern) => this.patternsFiller.fill(pattern, tiles));
    const uniquePatterns = getUniquePatterns(filledPatterns);
    const results = uniquePatterns.map(
      (pattern, index) =>
        new Result({
          cells: pattern.cells,
          collisions: pattern.getCollisions().map((collision) => collision.cells),
          id: index,
          points: getPatternScore(this.config, pattern),
        }),
    );
    return results;
  }
}

export default Solver;
