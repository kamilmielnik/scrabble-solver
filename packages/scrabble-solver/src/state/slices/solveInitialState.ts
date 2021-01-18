import boardInitialState from './boardInitialState';

const solveInitialState = {
  isLoading: false,
  lastSolvedParameters: {
    board: boardInitialState,
    characters: [] as string[],
  },
};

export default solveInitialState;
