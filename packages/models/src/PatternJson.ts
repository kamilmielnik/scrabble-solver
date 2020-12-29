import CellJson from './CellJson';

interface PatternJson {
  cells: (CellJson | null)[];
  collisions: PatternJson[];
  word: string;
}

export default PatternJson;
