import { CellJson } from './CellJson';
import { CollisionJson } from './CollisionJson';

export interface ResultJson {
  cells: CellJson[];
  collisions: CollisionJson[];
  id: number;
  points: number;
}
