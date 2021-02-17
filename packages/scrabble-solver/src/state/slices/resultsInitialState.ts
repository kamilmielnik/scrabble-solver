import { Result } from '@scrabble-solver/types';

import { ResultColumn, SortDirection } from 'types';

const resultsInitialState = {
  candidate: null as Result | null,
  sort: {
    column: ResultColumn.Points,
    direction: SortDirection.Descending,
  },
  results: undefined as Result[] | undefined,
};

export default resultsInitialState;
