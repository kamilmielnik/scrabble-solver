import type { BoardWord } from '@scrabble-solver/types';

import type { Sort, WordColumnId } from '@/types';

import type { BoardState } from '../board';

export interface VerifyState {
  isLoading: boolean;
  lastSolvedParameters: {
    board: BoardState;
  };
  invalidWords: BoardWord[];
  sort: Sort<WordColumnId>;
  validWords: BoardWord[];
}
