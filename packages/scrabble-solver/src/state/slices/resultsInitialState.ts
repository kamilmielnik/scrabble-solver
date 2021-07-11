import { Result } from '@scrabble-solver/types';

import { ResultColumn, SortDirection } from 'types';

const resultsInitialState = {
  candidate: null as Result | null,
  query: '',
  results: undefined as Result[] | undefined,
  sort: {
    column: ResultColumn.Points,
    direction: SortDirection.Descending,
  },
};

export default resultsInitialState;
