import { type Direction } from './Direction';

export interface BoardWord {
  direction: Direction;
  /** Absent until the word has been verified against a dictionary. */
  isValid?: boolean;
  word: string;
  x: number;
  y: number;
}
