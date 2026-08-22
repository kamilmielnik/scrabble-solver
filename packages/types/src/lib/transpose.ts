export function transpose<T>(array: T[][]): T[][] {
  const rows = array.length;
  const cols = array[0].length;
  const transposed: T[][] = Array(cols)
    .fill(null)
    .map(() => Array(rows));

  for (let y = 0; y < rows; ++y) {
    for (let x = 0; x < cols; ++x) {
      transposed[x][y] = array[y][x];
    }
  }

  return transposed;
}
