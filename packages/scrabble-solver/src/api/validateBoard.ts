import { Cell, Config } from '@scrabble-solver/types';

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
  } catch (error) {
    throw new Error(`Invalid "board" parameter: ${error.message}`);
  }

  const cells: Cell[] = board.flat().filter((cell) => cell.tile.character.length === 1);

  for (const cell of cells) {
    for (const characters of config.doubleCharacterTiles) {
      if (characters.startsWith(cell.tile.character)) {
        const canCheckDown = cell.y < board.length - 1;
        const canCheckRight = cell.x < board[0].length - 1;

        if (canCheckDown && board[cell.y + 1][cell.x].tile.character === characters[1]) {
          throw new Error(`Invalid "board" parameter: ${characters} can only be used as a single tile`);
        }

        if (canCheckRight && board[cell.y][cell.x + 1].tile.character === characters[1]) {
          throw new Error(`Invalid "board" parameter: ${characters} can only be used as a single tile`);
        }
      }
    }
  }
};

export default validateBoard;
