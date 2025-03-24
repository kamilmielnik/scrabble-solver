import { WordDefinition } from '@scrabble-solver/types';

export interface DictionaryState {
  error: unknown | undefined;
  input: string;
  isLoading: boolean;
  results: WordDefinition[];
}

export const dictionaryInitialState: DictionaryState = {
  error: undefined,
  input: '',
  isLoading: false,
  results: [],
};
