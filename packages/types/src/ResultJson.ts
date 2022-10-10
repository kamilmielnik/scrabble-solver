import CellJson from './CellJson';

interface ResultJson {
  cells: CellJson[];
  collisionsCount: number;
  id: number;
  points: number;
}

export default ResultJson;
