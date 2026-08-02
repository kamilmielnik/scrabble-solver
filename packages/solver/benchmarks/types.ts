import { type Locale } from '@scrabble-solver/types';

export interface Measurement {
  blanksCount: number;
  durations: number[];
  label: string;
  locale: Locale;
  resultsCount: number;
}
