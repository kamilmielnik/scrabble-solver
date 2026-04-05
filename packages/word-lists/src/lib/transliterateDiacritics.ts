import { transliterate } from 'transliteration';

import { unique } from './unique';

export const transliterateDiacritics = (words: string[], options?: Parameters<typeof transliterate>[1]): string[] => {
  return unique(words.map((word) => transliterate(word, options)));
};
