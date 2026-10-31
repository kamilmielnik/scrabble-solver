import { Board, Cell } from '@scrabble-solver/types';

/**
 * Re-centres a board onto a grid of a different size, dropping anything that
 * no longer fits.
 *
 * Extracted so that changing the game variant and switching between saved
 * boards cannot disagree about what happens to a board whose dimensions no
 * longer match the configuration. Variant is a global setting, so a saved
 * board can easily have been stored under a different size than the one in
 * force when it is loaded again.
 *
 * Returns the board unchanged -- the same instance, which matters for
 * re-render identity -- when it is already the right size.
 */
export const fitBoardToSize = (board: Board, { height, width }: { height: number; width: number }): Board => {
  if (board.rowsCount === height && board.columnsCount === width) {
    return board;
  }

  const fitted = Board.create(width, height);
  const offsetX = Math.floor(width / 2) - Math.floor(board.columnsCount / 2);
  const offsetY = Math.floor(height / 2) - Math.floor(board.rowsCount / 2);

  for (let y = 0; y < board.rowsCount; ++y) {
    for (let x = 0; x < board.columnsCount; ++x) {
      const cell = board.rows[y][x];

      if (cell.isEmpty) {
        continue;
      }

      const newX = x + offsetX;
      const newY = y + offsetY;

      if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
        continue;
      }

      fitted.updateCell(newX, newY, () => new Cell({ ...cell, x: newX, y: newY }));
    }
  }

  return fitted;
};

/** Pads or trims a rack to the configured size, keeping the tiles in place. */
export const fitRackToSize = <T>(rack: (T | null)[], size: number): (T | null)[] => {
  if (rack.length === size) {
    return rack;
  }

  const fitted = rack.slice(0, size);

  while (fitted.length < size) {
    fitted.push(null);
  }

  return fitted;
};
