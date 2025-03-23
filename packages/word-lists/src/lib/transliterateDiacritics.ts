import { OptionsTransliterate, transliterate } from 'transliteration';

import unique from './unique';

const transliterateDiacritics = (words: string[], options?: OptionsTransliterate): string[] => {
  return unique(words.map((word) => transliterate(word, options)));
};

export default transliterateDiacritics;
