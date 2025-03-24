import { OptionsTransliterate, transliterate } from 'transliteration';

import { unique } from './unique';

export const transliterateDiacritics = (words: string[], options?: OptionsTransliterate): string[] => {
  return unique(words.map((word) => transliterate(word, options)));
};
