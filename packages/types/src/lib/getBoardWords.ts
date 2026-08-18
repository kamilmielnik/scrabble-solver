import { type Board } from '../Board';
import { type BoardWord } from '../BoardWord';

import { getWordsInRows } from './getWordsInRows';
import { transpose } from './transpose';

export function getBoardWords(board: Board): BoardWord[] {
  const horizontalWords = getWordsInRows(board.rows, 'horizontal');
  const verticalWords = getWordsInRows(transpose(board.rows), 'vertical');
  return [...horizontalWords, ...verticalWords];
}
