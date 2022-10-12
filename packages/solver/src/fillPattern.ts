/* eslint-disable max-params, max-statements */
import { Trie } from '@kamilmielnik/trie';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Config, FinalPattern, Pattern, Tile } from '@scrabble-solver/types';

const fillPattern = (trie: Trie, config: Config, pattern: Pattern, tiles: Tile[]): Pattern[] => {
  if (pattern.getEmptyCellsCount() > tiles.length) {
    return [];
  }

  const results: Pattern[] = [];

  fillPatternRecursive(results, trie, config, pattern, pattern.toString(), tiles);

  return results;
};

export const fillPatternRecursive = (
  /** gets mutated when this function is called */
  results: Pattern[],
  trie: Trie,
  config: Config,
  pattern: Pattern,
  word: string,
  tiles: Tile[],
): void => {
  const indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();

  if (indexOfFirstCellWithoutTile === -1) {
    if (trie.has(word) && pattern.getCollisions().every((collision) => trie.has(collision.toString()))) {
      results.push(new FinalPattern(pattern.clone()));
    }

    return;
  }

  for (let index = 0; index < tiles.length; ++index) {
    const tile = tiles[index];
    const previousTile = pattern.cells[indexOfFirstCellWithoutTile].tile;

    pattern.cells[indexOfFirstCellWithoutTile].tile = tile;

    const indexOfNextCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
    const indexOfFirstEmptyLetter = word.indexOf(EMPTY_CELL);
    const prefix = word.substring(0, indexOfFirstEmptyLetter);
    const suffix = word.substring(indexOfFirstEmptyLetter + 1);
    const characters = tile.isBlank ? config.alphabet : [tile.character];

    for (const character of characters) {
      const newWordPrefix = prefix + character;
      const newWord = newWordPrefix + suffix;

      tile.character = character;

      if (indexOfNextCellWithoutTile === -1) {
        if (trie.has(newWord) && pattern.getCollisions().every((collision) => trie.has(collision.toString()))) {
          results.push(new FinalPattern(pattern.clone()));
        }
      } else if (trie.hasPrefix(newWordPrefix)) {
        tiles.splice(index, 1);
        fillPatternRecursive(results, trie, config, pattern, newWord, tiles);
        tiles.splice(index, 0, tile);
      }
    }

    pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;
  }
};

export default fillPattern;
