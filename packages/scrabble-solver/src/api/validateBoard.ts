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
    validateDoubleCharacterTiles(board, config);
  } catch (error) {
    throw new Error(`Invalid "board" parameter: ${error.message}`);
  }
};

const validateDoubleCharacterTiles = (board: Cell[][], config: Config): void => {
  const cells: Cell[] = board.flat().filter((cell) => cell.tile.character.length === 1);

  for (const cell of cells) {
    for (const characters of config.doubleCharacterTiles) {
      const canCheckDown = cell.y + 1 < board.length;
      const canCheckRight = cell.x + 1 < board[0].length;
      const collidesDown = canCheckDown && board[cell.y + 1][cell.x].tile.character === characters[1];
      const collidesRight = canCheckRight && board[cell.y][cell.x + 1].tile.character === characters[1];
      const collides = collidesDown || collidesRight;

      if (characters.startsWith(cell.tile.character) && collides) {
        throw new Error(`${characters} can only be used as a single tile`);
      }
    }
  }
};

export default validateBoard;
