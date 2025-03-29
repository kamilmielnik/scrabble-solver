import { WordDefinition } from '@scrabble-solver/types';

export interface DictionaryState {
  error: unknown;
  input: string;
  isLoading: boolean;
  results: WordDefinition[];
}
