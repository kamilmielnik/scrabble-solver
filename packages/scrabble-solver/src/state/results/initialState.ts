import { ResultColumnId, SortDirection } from 'types';

import type { ResultsState } from './types';

export const resultsInitialState: ResultsState = {
  candidate: null,
  displayMode: 'normal',
  query: '',
  results: undefined,
  sort: {
    column: ResultColumnId.Points,
    direction: SortDirection.Descending,
  },
};
