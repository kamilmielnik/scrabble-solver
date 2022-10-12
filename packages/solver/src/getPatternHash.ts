import { Pattern } from '@scrabble-solver/types';

const getPatternHash = (pattern: Pattern): string => {
  return pattern.cells
    .map((cell) => {
      const blank = cell.tile.isBlank ? '!' : '';
      const tile = cell.tile.character + blank;
      // eslint-disable-next-line prefer-template
      return cell.x + ',' + cell.y + ',' + tile;
    })
    .join('-');
};

export default getPatternHash;
