import { Pattern } from '@scrabble-solver/types';

import getPatternHash from './getPatternHash';

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
