import CellJson from './CellJson';

interface ResultJson {
  cells: CellJson[];
  id: number;
  numberOfCollisions: number;
  points: number;
}

export default ResultJson;
