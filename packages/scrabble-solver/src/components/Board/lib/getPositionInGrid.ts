import { Point } from 'types';

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
