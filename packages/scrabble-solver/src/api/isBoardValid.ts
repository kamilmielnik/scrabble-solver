import { BoardJson, CellJson, Config } from '@scrabble-solver/types';

import isRowValid from './isRowValid';

const isBoardValid = (board: BoardJson, config: Config): boolean => {
  if (board.length !== config.boardSize) {
    return false;
  }

  for (const row of board) {
    if (!isRowValid(row, config)) {
      return false;
    }
  }

  return areTwoCharacterTilesValid(board, config);
};

const areTwoCharacterTilesValid = (board: CellJson[][], config: Config): boolean => {
  const cells: CellJson[] = board
    .flat()
    .filter((cell) => cell && cell.tile && config.isTwoCharacterTilePrefix(cell.tile.character));

  for (const cell of cells) {
    for (const characters of config.twoCharacterTiles) {
      const canCheckDown = cell.y + 1 < board.length;
      const canCheckRight = cell.x + 1 < board[0].length;
      const cellDown = board[cell.y + 1][cell.x];
      const cellRight = board[cell.y][cell.x + 1];
      const collidesDown = canCheckDown && cellDown.tile && cellDown.tile.character === characters[1];
      const collidesRight = canCheckRight && cellRight.tile && cellRight.tile.character === characters[1];
      const collides = collidesDown || collidesRight;

      if (cell.tile && characters.startsWith(cell.tile.character) && collides) {
        return false;
      }
    }
  }

  return true;
};

export default isBoardValid;
