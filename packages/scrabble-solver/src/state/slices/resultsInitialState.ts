import { Result } from '@scrabble-solver/types';

import { ResultColumnId, Sort, SortDirection } from 'types';

export interface ResultsState {
  candidate: Result | null;
  query: string;
  results: Result[] | undefined;
  sort: Sort;
}

export const resultsInitialState: ResultsState = {
  candidate: null,
  query: '',
  results: undefined,
  sort: {
    column: ResultColumnId.Points,
    direction: SortDirection.Descending,
  },
};
