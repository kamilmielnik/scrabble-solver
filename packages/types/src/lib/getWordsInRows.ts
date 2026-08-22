import { type BoardWord } from '../BoardWord';
import { type Cell } from '../Cell';
import { type Direction } from '../Direction';

import { toBoardWord } from './toBoardWord';

/**
 * Cells in transposed rows keep their original coordinates,
 * so the first cell of a run is the word's start in both directions.
 */
export function getWordsInRows(cells: Cell[][], direction: Direction): BoardWord[] {
  const words: BoardWord[] = [];

  for (const row of cells) {
    let currentWord: Cell[] = [];

    for (const cell of row) {
      if (!cell.isEmpty) {
        currentWord.push(cell);
      } else if (currentWord.length > 0) {
        if (currentWord.length > 1) {
          words.push(toBoardWord(currentWord, direction));
        }
        currentWord = [];
      }
    }

    if (currentWord.length > 1) {
      words.push(toBoardWord(currentWord, direction));
    }
  }

  return words;
}
