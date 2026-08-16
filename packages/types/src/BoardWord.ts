import { type Direction } from './Direction';

export interface BoardWord {
  direction: Direction;
  /** Absent until the word has been verified against a dictionary. */
  isValid?: boolean;
  word: string;
  x: number;
  y: number;
}

export const isSameBoardWord = (a: BoardWord, b: BoardWord): boolean => {
  return a.direction === b.direction && a.x === b.x && a.y === b.y;
};
