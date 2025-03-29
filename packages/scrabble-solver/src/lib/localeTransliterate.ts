import { Locale } from '@scrabble-solver/types';
import { transliterate } from 'transliteration';

const transliteratePerLocale: Record<Locale, (word: string) => string> = {
  [Locale.DE_DE]: (word) => word,
  [Locale.EN_GB]: (word) => word,
  [Locale.EN_US]: (word) => word,
  [Locale.ES_ES]: (word) => transliterate(word, { ignore: ['ñ'] }),
  [Locale.FA_IR]: (word) => word,
  [Locale.FR_FR]: (word) => transliterate(word),
  [Locale.PL_PL]: (word) => word,
  [Locale.RO_RO]: (word) => transliterate(word),
  [Locale.TR_TR]: (word) => word,
};

export const localeTransliterate = (locale: Locale, value: string): string => {
  return transliteratePerLocale[locale](value);
};
