import type { Sort, VerifiedWord, WordColumnId } from '@/types';

import type { BoardState } from '../board';

export interface VerifyState {
  isLoading: boolean;
  lastSolvedParameters: {
    board: BoardState;
  };
  invalidWords: VerifiedWord[];
  query: string;
  sort: Sort<WordColumnId>;
  validWords: VerifiedWord[];
}
