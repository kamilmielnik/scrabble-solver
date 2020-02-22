export const createGridOf = (width, height, getInitialValue) =>
  createArray(height).map((row, y) => createArray(width).map((cell, x) => getInitialValue(x, y)));

export const createArray = (length) => Array.from({ length });
