import { type Result, type ShowCoordinates } from '@scrabble-solver/types';

import { createCoordinatesComparator } from '@/lib/createCoordinatesComparator';
import { createKeyComparator } from '@/lib/createKeyComparator';
import { createRegExp } from '@/lib/createRegExp';
import { createSortComparator } from '@/lib/createSortComparator';
import { getCoordinates as getPointCoordinates } from '@/lib/getCoordinates';
import { type CellFilter, type ComparatorFactory, type GroupedResults, ResultColumnId, type Sort } from '@/types';

export const getCoordinates = (result: Result, showCoordinates: ShowCoordinates): string => {
  const firstCell = result.cells[0];
  return getPointCoordinates({ isHorizontal: result.isHorizontal(), x: firstCell.x, y: firstCell.y }, showCoordinates);
};

export const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilters: CellFilter[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return undefined;
  }

  const regExp = createRegExp(query);

  const { matching, other } = results.reduce<GroupedResults>(
    (groupedResults, result) => {
      const matchesQuery = () => Boolean(result.word.match(regExp));

      if (resultMatchesCellFilter(result, cellFilters) && matchesQuery()) {
        groupedResults.matching.push(result);
      } else {
        groupedResults.other.push(result);
      }

      return groupedResults;
    },
    { matching: [], other: [] },
  );

  return { matching, other };
};

export const resultMatchesCellFilter = (result: Result, cellFilters: CellFilter[]): boolean => {
  const excludeFilters = cellFilters.filter((filter) => filter.type === 'exclude');
  const matchesExcludeFilters = excludeFilters.every(({ x, y }) => {
    return result.cells.every((cell) => cell.x !== x || cell.y !== y);
  });

  if (!matchesExcludeFilters) {
    return false;
  }

  const includeFilter = cellFilters.filter((filter) => filter.type === 'include');
  const matchesIncludeFilters = includeFilter.every(({ x, y }) => {
    return result.cells.some((cell) => cell.x === x && cell.y === y);
  });

  return matchesExcludeFilters && matchesIncludeFilters;
};

const comparators: Record<ResultColumnId, ComparatorFactory<Result>> = {
  [ResultColumnId.BlanksCount]: (locale: string) => createKeyComparator('blanksCount', locale),
  [ResultColumnId.ConsonantsCount]: (locale: string) => createKeyComparator('consonantsCount', locale),
  [ResultColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => {
    return createCoordinatesComparator({ getItemCoordinates: getCoordinates, locale, showCoordinates });
  },
  [ResultColumnId.Points]: (locale: string) => createKeyComparator('points', locale),
  [ResultColumnId.TilesCount]: (locale: string) => createKeyComparator('tilesCount', locale),
  [ResultColumnId.VowelsCount]: (locale: string) => createKeyComparator('vowelsCount', locale),
  [ResultColumnId.Word]: (locale: string) => createKeyComparator('word', locale),
  [ResultColumnId.WordsCount]: (locale: string) => createKeyComparator('wordsCount', locale),
};

export const sortResults = (
  results: Result[] | undefined,
  sort: Sort,
  locale: string,
  showCoordinates: ShowCoordinates,
): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return undefined;
  }

  return [...results].sort(createSortComparator({ comparators, locale, showCoordinates, sort }));
};
