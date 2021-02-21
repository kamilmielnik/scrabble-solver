import { Cell, Result } from '@scrabble-solver/types';

import { createKeyComparator } from 'lib';
import { Comparator, RemainingTile, ResultColumn } from 'types';

export const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

export const getRemainingCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => sum + count - usedCount, 0);
};

export const getTotalCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => sum + count, 0);
};

export const comparators: Record<ResultColumn, Comparator<Result>> = {
  [ResultColumn.BlanksCount]: createKeyComparator('numberOfBlanks'),
  [ResultColumn.ConsonantsCount]: createKeyComparator('numberOfConsonants'),
  [ResultColumn.Points]: createKeyComparator('points'),
  [ResultColumn.TilesCount]: createKeyComparator('numberOfTiles'),
  [ResultColumn.VowelsCount]: createKeyComparator('numberOfVowels'),
  [ResultColumn.Word]: createKeyComparator('word'),
  [ResultColumn.WordsCount]: createKeyComparator('numberOfWords'),
};
