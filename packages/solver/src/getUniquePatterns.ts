import { Pattern } from '@scrabble-solver/types';

const getPatternHash = (pattern: Pattern): string => {
  return pattern.cells
    .map((cell) => {
      const blank = cell.tile.isBlank ? '!' : '';
      const tile = cell.tile.character + blank;
      return cell.x + ',' + cell.y + ',' + tile;
    })
    .join('-');
};

const getUniquePatterns = (patterns: Pattern[]): Pattern[] => {
  const hashes = new Set<string>();
  const uniquePatterns: Pattern[] = [];

  for (const pattern of patterns) {
    const hash = getPatternHash(pattern);

    if (!hashes.has(hash)) {
      hashes.add(hash);
      uniquePatterns.push(pattern);
    }
  }

  return uniquePatterns;
};

export default getUniquePatterns;
