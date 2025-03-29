import { type DictionaryState } from './types';

export const dictionaryInitialState: DictionaryState = {
  error: undefined,
  input: '',
  isLoading: false,
  results: [],
};
