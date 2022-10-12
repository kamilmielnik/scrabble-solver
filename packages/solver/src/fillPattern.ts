/* eslint-disable max-params */
import { Trie } from '@kamilmielnik/trie';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { FinalPattern, Pattern, Tile } from '@scrabble-solver/types';

import generateBlankTilesPermutations from './generateBlankTilesPermutations';

const fillPattern = (trie: Trie, alphabet: string[], pattern: Pattern, tiles: Tile[]): Pattern[] => {
  if (pattern.getEmptyCellsCount() > tiles.length) {
    return [];
  }

  const results: Pattern[] = [];
  const tilesPermutations = generateBlankTilesPermutations(alphabet, tiles);

  for (let index = 0; index < tilesPermutations.length; ++index) {
    fillPatternWithoutBlanks(results, trie, pattern, pattern.toString(), tilesPermutations[index]);
  }

  return results;
};

const fillPatternWithoutBlanks = (
  /** gets mutated when this function is called */
  results: Pattern[],
  trie: Trie,
  pattern: Pattern,
  word: string,
  tiles: Tile[],
): void => {
  const indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();

  if (indexOfFirstCellWithoutTile === -1) {
    if (trie.has(word) && pattern.getCollisions().every((collision) => trie.has(collision.toString()))) {
      results.push(new FinalPattern(pattern.clone()));
    }
  } else {
    for (let index = 0; index < tiles.length; ++index) {
      const tile = tiles[index];
      const previousTile = pattern.cells[indexOfFirstCellWithoutTile].tile;
      pattern.cells[indexOfFirstCellWithoutTile].tile = tile;
      const indexOfNextCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
      const indexOfFirstEmptyLetter = word.indexOf(EMPTY_CELL);
      const newWordPrefix = word.substring(0, indexOfFirstEmptyLetter) + tile.character;
      const newWord = newWordPrefix + word.substring(indexOfFirstEmptyLetter + 1);
      if (indexOfNextCellWithoutTile === -1) {
        if (trie.has(newWord) && pattern.getCollisions().every((collision) => trie.has(collision.toString()))) {
          results.push(new FinalPattern(pattern.clone()));
        }
      } else if (trie.hasPrefix(newWordPrefix)) {
        tiles.splice(index, 1);
        fillPatternWithoutBlanks(results, trie, pattern, newWord, tiles);
        tiles.splice(index, 0, tile);
      }
      pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;
    }
  }
};

export default fillPattern;
