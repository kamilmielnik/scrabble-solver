import { type Sort, SortDirection } from '@/types';

export const getNextSort = <Id extends string>(sort: Sort<Id>, column: Id): Sort<Id> => {
  return {
    column,
    direction: sort.column === column ? toggleDirection(sort.direction) : sort.direction,
  };
};

const toggleDirection = (direction: SortDirection): SortDirection => {
  return direction === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending;
};
