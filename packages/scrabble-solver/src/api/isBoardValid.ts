import { type BoardJson, type CellJson, type Config } from '@scrabble-solver/types';

import { isRowValid } from './isRowValid';

export const INVALID_BOARD_MESSAGE = 'Invalid "board" parameter';

export function isBoardValid(board: BoardJson, config: Config): boolean {
  if (board.length !== config.boardHeight) {
    return false;
  }

  for (const row of board) {
    if (!isRowValid(row, config)) {
      return false;
    }
  }

  const columns = board[0].map((_, x) => board.map((row) => row[x]));
  return ![...board, ...columns].some((line) => readRuns(line).some((run) => config.spellsDigraph(run)));
}

function readRuns(line: CellJson[]): string[][] {
  const runs: string[][] = [[]];

  for (const cell of line) {
    if (cell.tile) {
      runs[runs.length - 1].push(cell.tile.character);
    } else {
      runs.push([]);
    }
  }

  return runs;
}
