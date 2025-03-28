import { boardInitialState } from '../board';

import type { VerifyState } from './types';

export const verifyInitialState: VerifyState = {
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
  },
  invalidWords: [],
  validWords: [],
};
