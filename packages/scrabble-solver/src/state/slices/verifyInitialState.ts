import boardInitialState, { BoardState } from './boardInitialState';

export interface VerifyState {
  isLoading: boolean;
  lastSolvedParameters: {
    board: BoardState;
  };
  invalidWords: string[];
  validWords: string[];
}

const verifyInitialState: VerifyState = {
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
  },
  invalidWords: [],
  validWords: [],
};

export default verifyInitialState;
