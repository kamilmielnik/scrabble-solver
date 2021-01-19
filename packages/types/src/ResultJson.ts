import CellJson from './CellJson';

interface ResultJson {
  cells: (CellJson | null)[];
  id: number;
  numberOfCollisions: number;
  points: number;
}

export default ResultJson;
