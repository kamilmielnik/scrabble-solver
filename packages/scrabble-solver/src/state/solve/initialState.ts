import { boardInitialState } from '../board';

import type { SolveState } from './types';

export const solveInitialState: SolveState = {
  error: undefined,
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
    characters: [],
  },
};
