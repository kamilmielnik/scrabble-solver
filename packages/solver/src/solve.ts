import { Trie } from '@kamilmielnik/trie';
import { Board, Config, Result, Tile } from '@scrabble-solver/types';

import fillPattern from './fillPattern';
import generatePatterns from './generatePatterns';
import getPatternScore from './getPatternScore';
import getUniquePatterns from './getUniquePatterns';

const solve = (trie: Trie, config: Config, board: Board, tiles: Tile[]): Result[] => {
  const patterns = generatePatterns(config, board);
  const filledPatterns = patterns.flatMap((pattern) => fillPattern(trie, config.alphabet, pattern, tiles));
  const uniquePatterns = getUniquePatterns(filledPatterns);
  const results = uniquePatterns.map(
    (pattern, index) =>
      new Result({
        cells: pattern.cells,
        collisions: pattern.getCollisions().map((collision) => collision.cells),
        id: index,
        points: getPatternScore(config, pattern),
      }),
  );
  return results;
};

export default solve;
