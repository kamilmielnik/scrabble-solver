import createArray from './createArray';

const createGridOf = <T>(width: number, height: number, getInitialValue: (x: number, y: number) => T): T[][] => {
  return createArray(height).map((_, y) => {
    return createArray(width).map((_, x) => {
      return getInitialValue(x, y);
    });
  });
};

export default createGridOf;
