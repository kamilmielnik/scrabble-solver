import { type Result } from '@scrabble-solver/types';

import type { Sort } from 'types';

export interface ResultsState {
  candidate: Result | null;
  displayMode: 'normal' | 'shortHint' | 'longHint';
  query: string;
  results: Result[] | undefined;
  sort: Sort;
}
