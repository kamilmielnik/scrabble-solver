import boardInitialState from './boardInitialState';

const verifyInitialState = {
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
  },
  invalidWords: [] as string[],
  validWords: [] as string[],
};

export default verifyInitialState;
