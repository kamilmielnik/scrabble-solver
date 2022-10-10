import CellJson from './CellJson';

interface ResultJson {
  cells: (CellJson | null)[];
  collisionsCount: number;
  id: number;
  points: number;
}

export default ResultJson;
