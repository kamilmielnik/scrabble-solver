import { Locale } from '@scrabble-solver/types';

const COMBINING_MARKS = /[̀-ͯ]/g;

const NON_DECOMPOSABLE: Record<string, string> = {
  Æ: 'AE',
  Œ: 'OE',
  æ: 'ae',
  œ: 'oe',
};

const transliteratePerLocale: Record<Locale, (word: string) => string> = {
  [Locale.DE_DE]: (word) => word,
  [Locale.EN_GB]: (word) => word,
  [Locale.EN_US]: (word) => word,
  [Locale.ES_ES]: (word) => foldDiacritics(word, ['ñ', 'Ñ']),
  [Locale.FA_IR]: (word) => word,
  [Locale.FR_FR]: (word) => foldDiacritics(word),
  [Locale.PL_PL]: (word) => word,
  [Locale.RO_RO]: (word) => foldDiacritics(word),
  [Locale.TR_TR]: (word) => word,
};

export function localeTransliterate(locale: Locale, value: string): string {
  return transliteratePerLocale[locale](value);
}

function foldDiacritics(word: string, ignore: readonly string[] = []): string {
  return Array.from(word)
    .map((character) => {
      if (ignore.includes(character)) {
        return character;
      }

      return NON_DECOMPOSABLE[character] ?? character.normalize('NFD').replace(COMBINING_MARKS, '');
    })
    .join('');
}
