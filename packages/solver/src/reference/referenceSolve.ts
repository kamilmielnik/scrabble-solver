import { type Board, type Config, type ResultJson, type Tile } from '@scrabble-solver/types';

import { areDigraphsValid } from '../areDigraphsValid';
import { getPatternScore } from '../getPatternScore';
import { getUniquePatterns } from '../getUniquePatterns';

import { fillPattern } from './fillPattern';
import { generatePatterns } from './generatePatterns';
import { type WordFinder } from './WordFinder';

/**
 * The previous, pattern-enumeration-based solver. Kept as a reference
 * implementation to test the GADDAG move generator against — do not use it in
 * production code, it is orders of magnitude slower.
 */
export const referenceSolve = (trie: WordFinder, config: Config, board: Board, tiles: Tile[]): ResultJson[] => {
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
