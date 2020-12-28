import { Result } from '@scrabble-solver/models';

interface State {
  candidate: Result | null;
  results: Result[];
}

const resultsInitialState: State = {
  candidate: null,
  results: [],
};

export default resultsInitialState;
