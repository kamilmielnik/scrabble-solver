import type CellJson from './CellJson';
import type CollisionJson from './CollisionJson';

interface ResultJson {
  cells: CellJson[];
  collisions: CollisionJson[];
  id: number;
  points: number;
}

export default ResultJson;
