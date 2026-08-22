import { type BoardWord } from '../BoardWord';
import { type Cell } from '../Cell';
import { type Direction } from '../Direction';

export function toBoardWord(cells: Cell[], direction: Direction): BoardWord {
  return {
    direction,
    word: cells.map((cell) => cell.tile.character).join(''),
    x: cells[0].x,
    y: cells[0].y,
  };
}
