import { BONUS_WORD } from '@scrabble-solver/constants';
import { type Board, type Bonus, type Config } from '@scrabble-solver/types';

import { COLOR_BONUS_CHARACTER, COLOR_BONUS_CHARACTER_MULTIPLIER, COLOR_BONUS_WORD } from '@/parameters';
import { type Direction, type Point } from '@/types';

export const createGrid = <T>(width: number, height: number, getInitialValue: (x: number, y: number) => T): T[][] => {
  return Array.from({ length: height }).map((_row, y) => {
    return Array.from({ length: width }).map((_cell, x) => {
      return getInitialValue(x, y);
    });
  });
};

export const getBonusColor = (bonus: Bonus): string => {
  if (bonus.type === BONUS_WORD) {
    return COLOR_BONUS_WORD[bonus.multiplier];
  }

  if (bonus.score) {
    return COLOR_BONUS_CHARACTER[bonus.score];
  }

  return COLOR_BONUS_CHARACTER_MULTIPLIER[bonus.multiplier];
};

export const getPositionInGrid = <T>(grid: T[][], constraint: (value: T) => boolean): Point | undefined => {
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[0].length; ++x) {
      if (constraint(grid[y][x])) {
        return { x, y };
      }
    }
  }

  return undefined;
};

export const getReachableCells = (config: Config, board: Board, charactersCount: number): boolean[][] => {
  const { boardHeight, boardWidth } = config;
  const reachable = createGrid(boardWidth, boardHeight, () => false);

  if (charactersCount === 0) {
    return reachable;
  }

  const isBoardEmpty = board.isEmpty();
  const center = board.center;

  const isAnchor = (x: number, y: number, playDirection: Direction): boolean => {
    if (isBoardEmpty) {
      return x === center.x && y === center.y;
    }

    if (playDirection === 'horizontal') {
      const above = y > 0 && !board.rows[y - 1][x].isEmpty;
      const below = y < boardHeight - 1 && !board.rows[y + 1][x].isEmpty;
      return above || below;
    }

    const left = x > 0 && !board.rows[y][x - 1].isEmpty;
    const right = x < boardWidth - 1 && !board.rows[y][x + 1].isEmpty;
    return left || right;
  };

  const isReachableInDirection = (x: number, y: number, direction: Direction): boolean => {
    const isHorizontal = direction === 'horizontal';
    const length = isHorizontal ? boardWidth : boardHeight;
    const startOffset = isHorizontal ? x : y;
    const cellAt = (offset: number) => (isHorizontal ? board.rows[y][offset] : board.rows[offset][x]);

    if (isAnchor(x, y, direction)) {
      return true;
    }

    for (const step of [-1, 1] as const) {
      let newTiles = 1;

      for (let offset = startOffset + step; offset >= 0 && offset < length; offset += step) {
        const cell = cellAt(offset);

        if (cell.hasTile()) {
          if (newTiles <= charactersCount) {
            return true;
          }
          break;
        }

        newTiles += 1;

        if (newTiles > charactersCount) {
          break;
        }

        if (isAnchor(cell.x, cell.y, direction)) {
          return true;
        }
      }
    }

    return false;
  };

  for (let y = 0; y < boardHeight; ++y) {
    for (let x = 0; x < boardWidth; ++x) {
      if (board.rows[y][x].hasTile()) {
        reachable[y][x] = true;
        continue;
      }

      if (isReachableInDirection(x, y, 'horizontal') || isReachableInDirection(x, y, 'vertical')) {
        reachable[y][x] = true;
      }
    }
  }

  return reachable;
};
