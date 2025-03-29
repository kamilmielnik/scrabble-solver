import { Result, ShowCoordinates } from '@scrabble-solver/types';

import { createKeyComparator, createRegExp, createStringComparator, getCoordinates, reverseComparator } from 'lib';
import { CellFilter, Comparator, GroupedResults, ResultColumnId, Sort, SortDirection } from 'types';

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

const comparators: Record<ResultColumnId, (locale: string, showCoordinates: ShowCoordinates) => Comparator<Result>> = {
  [ResultColumnId.BlanksCount]: (locale: string) => createKeyComparator('blanksCount', locale),
  [ResultColumnId.ConsonantsCount]: (locale: string) => createKeyComparator('consonantsCount', locale),
  [ResultColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => (a, b) => {
    const stringComparator = createStringComparator(locale);
    const aValue = getCoordinates(a, showCoordinates);
    const bValue = getCoordinates(b, showCoordinates);
    return stringComparator(aValue, bValue);
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

  const createComparator = comparators[sort.column];
  const comparator = createComparator(locale, showCoordinates);
  const finalComparator = sort.direction === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  const sortedResults = [...results].sort(finalComparator);
  return sortedResults;
};
