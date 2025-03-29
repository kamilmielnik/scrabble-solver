export const createGrid = <T>(width: number, height: number, getInitialValue: (x: number, y: number) => T): T[][] => {
  return Array.from({ length: height }).map((_row, y) => {
    return Array.from({ length: width }).map((_cell, x) => {
      return getInitialValue(x, y);
    });
  });
};
