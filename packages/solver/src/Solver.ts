import { Trie } from '@kamilmielnik/trie';
import { Board, Config, Result, Tile } from '@scrabble-solver/types';

import generatePatterns from './generatePatterns';
import getPatternScore from './getPatternScore';
import getUniquePatterns from './getUniquePatterns';
import PatternsFiller from './PatternsFiller';

class Solver {
  private readonly config: Config;

  private readonly patternsFiller: PatternsFiller;

  constructor(config: Config, trie: Trie) {
    this.config = config;
    this.patternsFiller = new PatternsFiller(config, trie);
  }

  public solve(board: Board, tiles: Tile[]): Result[] {
    const patterns = generatePatterns(this.config, board);
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
