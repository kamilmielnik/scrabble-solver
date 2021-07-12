import { CellJson, Config } from '@scrabble-solver/types';

import validateRow from './validateRow';

const validateBoard = (board: unknown, config: Config): void => {
  if (!Array.isArray(board)) {
    throw new Error('Invalid "board" parameter: not an array');
  }

  if (board.length !== config.boardHeight) {
    throw new Error(`Invalid "board" parameter: does not have ${config.boardHeight} rows`);
  }

  try {
    board.forEach((row, rowIndex) => validateRow(row, rowIndex, config));
    validateDoubleCharacterTiles(board, config);
  } catch (error) {
    throw new Error(`Invalid "board" parameter: ${error.message}`);
  }
};

const validateDoubleCharacterTiles = (board: CellJson[][], config: Config): void => {
  const cells: CellJson[] = board
    .flat()
    .filter((cell) => cell.tile && config.isDoubleCharacterPrefix(cell.tile.character));

  for (const cell of cells) {
    for (const characters of config.doubleCharacterTiles) {
      const canCheckDown = cell.y + 1 < board.length;
      const canCheckRight = cell.x + 1 < board[0].length;
      const cellDown = board[cell.y + 1][cell.x];
      const cellRight = board[cell.y][cell.x + 1];
      const collidesDown = canCheckDown && cellDown.tile && cellDown.tile.character === characters[1];
      const collidesRight = canCheckRight && cellRight.tile && cellRight.tile.character === characters[1];
      const collides = collidesDown || collidesRight;

      if (cell.tile && characters.startsWith(cell.tile.character) && collides) {
        throw new Error(`${characters} can only be used as a single tile`);
      }
    }
  }
};

export default validateBoard;
