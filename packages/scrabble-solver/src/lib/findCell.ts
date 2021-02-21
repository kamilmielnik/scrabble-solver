import { Cell } from '@scrabble-solver/types';

const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

export default findCell;
