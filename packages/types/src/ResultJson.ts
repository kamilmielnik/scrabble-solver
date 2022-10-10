import CellJson from './CellJson';
import CollisionJson from './CollisionJson';

interface ResultJson {
  cells: CellJson[];
  collisions: CollisionJson[];
  id: number;
  points: number;
}

export default ResultJson;
