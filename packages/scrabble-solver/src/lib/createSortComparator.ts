import { type ShowCoordinates } from '@scrabble-solver/types';

import { type Comparator, type ComparatorFactory, type Sort, SortDirection } from '@/types';

import { reverseComparator } from './reverseComparator';

interface Parameters<Item, Id extends string> {
  comparators: Record<Id, ComparatorFactory<Item>>;
  locale: string;
  showCoordinates: ShowCoordinates;
  sort: Sort<Id>;
}

export function createSortComparator<Item, Id extends string>({
  comparators,
  locale,
  showCoordinates,
  sort,
}: Parameters<Item, Id>): Comparator<Item> {
  const comparator = comparators[sort.column](locale, showCoordinates);
  return sort.direction === SortDirection.Descending ? reverseComparator(comparator) : comparator;
}
