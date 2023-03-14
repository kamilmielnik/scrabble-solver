import { Result } from '@scrabble-solver/types';

import { ResultColumn, Sort, SortDirection } from 'types';

export interface ResultsState {
  candidate: Result | null;
  query: string;
  results: Result[] | undefined;
  sort: Sort;
}

const resultsInitialState: ResultsState = {
  candidate: null,
  query: '',
  results: undefined,
  sort: {
    column: ResultColumn.Points,
    direction: SortDirection.Descending,
  },
};

export default resultsInitialState;
