import { type CellJson } from './CellJson';
import { type CollisionJson } from './CollisionJson';

export interface ResultJson {
  cells: CellJson[];
  collisions: CollisionJson[];
  id: number;
  points: number;
}
