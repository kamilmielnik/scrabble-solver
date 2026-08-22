import { type BoardWord } from '../BoardWord';

export function isSameBoardWord(a: BoardWord, b: BoardWord): boolean {
  return a.direction === b.direction && a.x === b.x && a.y === b.y;
}
