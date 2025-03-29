import { type Trie } from '@kamilmielnik/trie';
import { type Board, type Config, type ResultJson, type Tile } from '@scrabble-solver/types';

import { areDigraphsValid } from './areDigraphsValid';
import { fillPattern } from './fillPattern';
import { generatePatterns } from './generatePatterns';
import { getPatternScore } from './getPatternScore';
import { getUniquePatterns } from './getUniquePatterns';

export const solve = (trie: Trie, config: Config, board: Board, tiles: Tile[]): ResultJson[] => {
  const patterns = generatePatterns(config, board);
  const filledPatterns = patterns.flatMap((pattern) => fillPattern(trie, config, pattern, tiles));
  const validPatterns =
    config.twoCharacterTiles.length > 0
      ? filledPatterns.filter((pattern) => areDigraphsValid(config, pattern))
      : filledPatterns;
  const uniquePatterns = getUniquePatterns(validPatterns);
  const results = uniquePatterns.map((pattern, index) => ({
    cells: pattern.cells.map((cell) => cell.toJson()),
    collisions: pattern.getCollisions().map((collision) => collision.cells.map((cell) => cell.toJson())),
    id: index,
    points: getPatternScore(config, pattern),
  }));

  return results;
};
