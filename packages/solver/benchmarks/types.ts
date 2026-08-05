import { type Locale } from '@scrabble-solver/types';

export interface LanguageScenario {
  baseRack: string[];
  boardRows: string[];
  label: string;
  locale: Locale;
}

export interface Measurement {
  blanksCount: number;
  durations: number[];
  label: string;
  locale: Locale;
  resultsCount: number;
}
