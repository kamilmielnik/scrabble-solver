import { Board } from '@scrabble-solver/types';

import { boardInitialState } from './boardInitialState';

export interface SolveState {
  error: unknown | undefined;
  isLoading: boolean;
  lastSolvedParameters: {
    board: Board;
    characters: string[];
  };
}

export const solveInitialState: SolveState = {
  error: undefined,
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
    characters: [],
  },
};
