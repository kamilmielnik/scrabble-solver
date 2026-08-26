import { type EventOf } from '@scrabble-solver/logger';
import { type Board } from '@scrabble-solver/types';

type BoardField = 'board' | 'tiles' | 'blanks';

type BoardLogFields = Pick<EventOf<'solve'>, BoardField> & Pick<EventOf<'verify'>, BoardField>;

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
