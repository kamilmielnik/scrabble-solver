import { Result } from '@scrabble-solver/types';

const resultsInitialState = {
  candidate: null as Result | null,
  results: undefined as Result[] | undefined,
};

export default resultsInitialState;
