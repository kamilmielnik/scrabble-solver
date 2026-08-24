import { type Board } from '@scrabble-solver/types';

interface BoardLogFields {
  board: string;
  tiles: number;
  blanks: number;
}

export function getBoardLogFields(board: Board): BoardLogFields {
  return {
    board: formatBoard(board),
    tiles: board.getTilesCount(),
    blanks: board.getBlanksCount(),
  };
}

function formatBoard(board: Board): string {
  return board
    .toString()
    .split('\n')
    .map((row) => row.trimEnd())
    .join('|')
    .replace(/\|+$/, '');
}
