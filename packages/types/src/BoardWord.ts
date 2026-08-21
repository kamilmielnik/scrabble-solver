import { type Direction } from './Direction';

export interface BoardWord {
  direction: Direction;
  word: string;
  x: number;
  y: number;
}
