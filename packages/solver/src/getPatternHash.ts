import { Pattern } from '@scrabble-solver/types';

const getPatternHash = (pattern: Pattern): string => {
  return pattern.cells
    .filter((cell) => cell.isEmpty)
    .map((cell) => {
      const blank = cell.tile.isBlank ? '!' : '';
      const tile = cell.tile.character + blank;
      return [cell.x, cell.y, tile].join(',');
    })
    .join('-');
};

export default getPatternHash;
