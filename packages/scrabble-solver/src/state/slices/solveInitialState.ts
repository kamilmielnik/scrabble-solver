import { Board } from '@scrabble-solver/types';

import boardInitialState from './boardInitialState';

interface SolveInitialState {
  error: unknown | undefined;
  isLoading: boolean;
  lastSolvedParameters: {
    board: Board;
    characters: string[];
  };
}

const solveInitialState: SolveInitialState = {
  error: undefined,
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
    characters: [],
  },
};

export default solveInitialState;
