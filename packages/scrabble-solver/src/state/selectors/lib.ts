import { Cell, Result } from '@scrabble-solver/types';

import { createKeyComparator, reverseComparator } from 'lib';
import { Comparator, RemainingTile, ResultColumn, SortDirection } from 'types';

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

export const getTotalCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

export const sortResults = (results: Result[], column: ResultColumn, sortDirection: SortDirection): Result[] => {
  const comparator = comparators[column];
  const finalComparator = sortDirection === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...results].sort(finalComparator);
};
