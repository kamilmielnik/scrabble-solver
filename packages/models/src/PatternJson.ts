import CellJson from './CellJson';

interface PatternJson {
  cells: CellJson[];
  collisions: PatternJson[];
  word: string;
}

export default PatternJson;
