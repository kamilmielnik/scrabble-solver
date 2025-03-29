import { type Board } from '@scrabble-solver/types';

export interface SolveState {
  error: unknown;
  isLoading: boolean;
  lastSolvedParameters: {
    board: Board;
    characters: string[];
  };
}
