import { type BoardJson, type CellJson, type Config } from '@scrabble-solver/types';

import { isRowValid } from './isRowValid';

interface Step {
  x: number;
  y: number;
}

const STEPS: Step[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

export const isBoardValid = (board: BoardJson, config: Config): boolean => {
  if (board.length !== config.boardHeight) {
    return false;
  }

  for (const row of board) {
    if (!isRowValid(row, config)) {
      return false;
    }
  }

  return !board.flat().some((cell) => spellsDigraph(board, cell, config));
};

function spellsDigraph(board: CellJson[][], cell: CellJson, config: Config): boolean {
  return STEPS.some((step) => spellsDigraphAlong(board, cell, config, step));
}

function spellsDigraphAlong(board: CellJson[][], cell: CellJson, config: Config, { x, y }: Step): boolean {
  if (!cell.tile) {
    return false;
  }

  let spelled = cell.tile.character;

  for (let offset = 1; spelled.length < config.longestDigraphLength; ++offset) {
    const nextTile = board[cell.y + y * offset]?.[cell.x + x * offset]?.tile;

    if (!nextTile) {
      return false;
    }

    spelled += nextTile.character;

    if (config.digraphs.includes(spelled)) {
      return true;
    }
  }

  return false;
}
