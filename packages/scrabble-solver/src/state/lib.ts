import { BLANK } from '@scrabble-solver/constants';
import { type Board, type Config } from '@scrabble-solver/types';

import { createKeyComparator } from 'lib';
import { type RemainingTile } from 'types';

export const getRemainingTiles = (
  config: Config,
  board: Board,
  characters: string[],
  locale: string,
): RemainingTile[] => {
  const nonEmptyCells = board.rows.flat().filter((cell) => !cell.isEmpty);
  const letterCells = nonEmptyCells.filter((cell) => !cell.tile.isBlank);
  const remainingTiles = Object.fromEntries(config.tiles.map((tile) => [tile.character, { ...tile, usedCount: 0 }]));
  const blank: RemainingTile = {
    character: BLANK,
    count: config.blanksCount,
    score: config.blankScore,
    usedCount:
      nonEmptyCells.filter((cell) => cell.tile.isBlank).length +
      characters.filter((character) => character === BLANK).length,
  };
  const letters = [
    ...letterCells.map((cell) => cell.tile.character),
    ...characters.filter((letter) => letter !== BLANK),
  ];
  const unknownLetters = letters.filter((letter) => typeof remainingTiles[letter] === 'undefined');

  for (const letter of unknownLetters) {
    remainingTiles[letter] = {
      character: letter,
      count: 0,
      score: 0,
      usedCount: 0,
    };
  }

  for (const letter of letters) {
    ++remainingTiles[letter].usedCount;
  }

  const comparator = createKeyComparator('character', locale);

  return [...Object.values(remainingTiles).sort(comparator), blank];
};
