import { ResultColumnId, SortDirection } from 'types';

import type { ResultsState } from './types';

export const resultsInitialState: ResultsState = {
  candidate: null,
  query: '',
  results: undefined,
  sort: {
    column: ResultColumnId.Points,
    direction: SortDirection.Descending,
  },
};
