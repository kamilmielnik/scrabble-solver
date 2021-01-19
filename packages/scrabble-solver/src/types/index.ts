import { Board } from '@scrabble-solver/types';

export type Comparator<T> = (a: T, B: T) => number;

export interface ServerLoggingData {
  origin?: string;
  referer?: string;
  userAgent?: string;
  xForwardedFor?: string | string[];
  xRealIp?: string | string[];
}

export interface SolveParameters {
  board: Board;
  characters: string[];
}
