import { BLANK } from '@scrabble-solver/constants';
import { Board, Config } from '@scrabble-solver/types';

import { RemainingTile } from 'types';

import createKeyComparator from './createKeyComparator';

const getRemainingTiles = (config: Config, board: Board, characters: string[]): RemainingTile[] => {
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

  return [...Object.values(remainingTiles).sort(createKeyComparator('character')), blank];
};

export default getRemainingTiles;
