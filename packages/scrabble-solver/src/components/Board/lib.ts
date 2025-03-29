import { BONUS_WORD } from '@scrabble-solver/constants';
import { Bonus } from '@scrabble-solver/types';

import { COLOR_BONUS_CHARACTER, COLOR_BONUS_CHARACTER_MULTIPLIER, COLOR_BONUS_WORD } from 'parameters';
import { Point } from 'types';

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
