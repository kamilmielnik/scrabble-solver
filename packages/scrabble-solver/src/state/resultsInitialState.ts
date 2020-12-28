import { Result } from '@scrabble-solver/models';

const resultsInitialState = {
  candidate: null as Result | null,
  results: [] as Result[],
};

export default resultsInitialState;
