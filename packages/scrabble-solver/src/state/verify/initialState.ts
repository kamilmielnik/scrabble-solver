import { SortDirection, WordColumnId } from '@/types';

import { boardInitialState } from '../board';

import type { VerifyState } from './types';

export const verifyInitialState: VerifyState = {
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
  },
  invalidWords: [],
  query: '',
  sort: {
    column: WordColumnId.Word,
    direction: SortDirection.Ascending,
  },
  validWords: [],
};
