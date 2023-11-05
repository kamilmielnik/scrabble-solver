import latinize from 'latinize';

import unique from './unique';

const latinizeDiacritics = (words: string[]): string[] => {
  return unique(words.map((word) => latinize(word)));
};

export default latinizeDiacritics;
