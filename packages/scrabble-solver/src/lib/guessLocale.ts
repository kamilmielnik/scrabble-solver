import { Locale } from '@scrabble-solver/types';

export const guessLocale = (): Locale => {
  if (!globalThis.navigator) {
    return Locale.EN_US;
  }

  const locales = Object.values(Locale);
  const exactMatch = locales.find((locale) => globalThis.navigator.language === locale);

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = locales.find((locale) => {
    return globalThis.navigator.language === locale.substring(0, 2);
  });

  return partialMatch || Locale.EN_US;
};
