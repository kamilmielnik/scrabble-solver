import { Result } from '@scrabble-solver/types';

import type { Sort } from 'types';

export interface ResultsState {
  candidate: Result | null;
  query: string;
  results: Result[] | undefined;
  sort: Sort;
}
