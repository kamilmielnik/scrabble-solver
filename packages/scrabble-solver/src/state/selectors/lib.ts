import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import { Board, Cell, Config, Result } from '@scrabble-solver/types';

import { createKeyComparator, reverseComparator } from 'lib';
import { Comparator, RemainingTile, RemainingTilesGroup, ResultColumn, SortDirection } from 'types';

const comparators: Record<ResultColumn, Comparator<Result>> = {
  [ResultColumn.BlanksCount]: createKeyComparator('numberOfBlanks'),
  [ResultColumn.ConsonantsCount]: createKeyComparator('numberOfConsonants'),
  [ResultColumn.Points]: createKeyComparator('points'),
  [ResultColumn.TilesCount]: createKeyComparator('numberOfTiles'),
  [ResultColumn.VowelsCount]: createKeyComparator('numberOfVowels'),
  [ResultColumn.Word]: createKeyComparator('word'),
  [ResultColumn.WordsCount]: createKeyComparator('numberOfWords'),
};

export const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

export const getRemainingCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => sum + count - usedCount, 0);
};

export const getRemainingTiles = (config: Config, board: Board, characters: string[]): RemainingTile[] => {
  const nonEmptyCells = board.rows.flat().filter((cell) => !cell.isEmpty);
  const letterCells = nonEmptyCells.filter((cell) => !cell.tile.isBlank);
  const remainingTiles = Object.fromEntries(config.tiles.map((tile) => [tile.character, { ...tile, usedCount: 0 }]));
  const blank: RemainingTile = {
    character: BLANK,
    count: config.numberOfBlanks,
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

export const getRemainingTilesGroups = (remainingTiles: RemainingTile[]): RemainingTilesGroup[] => {
  const consonants = remainingTiles.filter(({ character }) => CONSONANTS.includes(character));
  const vowels = remainingTiles.filter(({ character }) => VOWELS.includes(character));
  const blanks = remainingTiles.filter(({ character }) => character === BLANK);

  return [
    {
      remainingCount: getRemainingCount(vowels),
      tiles: vowels,
      translationKey: 'common.vowels',
      totalCount: getTotalCount(vowels),
    },
    {
      remainingCount: getRemainingCount(consonants),
      tiles: consonants,
      translationKey: 'common.consonants',
      totalCount: getTotalCount(consonants),
    },
    {
      remainingCount: getRemainingCount(blanks),
      tiles: blanks,
      translationKey: 'common.blanks',
      totalCount: getTotalCount(blanks),
    },
  ];
};

export const getTotalCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

export const sortResults = (
  results: Result[] | undefined,
  column: ResultColumn,
  sortDirection: SortDirection,
): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const comparator = comparators[column];
  const finalComparator = sortDirection === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...results].sort(finalComparator);
};
