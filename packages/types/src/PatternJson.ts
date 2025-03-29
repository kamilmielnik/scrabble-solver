import { type CellJson } from './CellJson';

export interface PatternJson {
  cells: CellJson[];
  collisions: PatternJson[];
  word: string;
}
