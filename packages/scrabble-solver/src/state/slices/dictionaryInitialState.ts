import { WordDefinition } from '@scrabble-solver/types';

const dictionaryInitialState = {
  input: '',
  isLoading: false,
  results: [] as WordDefinition[],
};

export default dictionaryInitialState;
