import type { BoardState } from '../board';

export interface VerifyState {
  isLoading: boolean;
  lastSolvedParameters: {
    board: BoardState;
  };
  invalidWords: string[];
  validWords: string[];
}
