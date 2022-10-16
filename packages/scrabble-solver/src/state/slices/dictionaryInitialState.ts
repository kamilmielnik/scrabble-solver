import { WordDefinition } from '@scrabble-solver/types';

interface DictionaryInitialState {
  error: unknown | undefined;
  input: string;
  isLoading: boolean;
  results: WordDefinition[];
}

const dictionaryInitialState: DictionaryInitialState = {
  error: undefined,
  input: '',
  isLoading: false,
  results: [],
};

export default dictionaryInitialState;
