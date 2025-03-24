import { createArray } from './createArray';

export const createGridOf = <T>(width: number, height: number, getInitialValue: (x: number, y: number) => T): T[][] => {
  return createArray(height).map((_row, y) => {
    return createArray(width).map((_cell, x) => {
      return getInitialValue(x, y);
    });
  });
};
