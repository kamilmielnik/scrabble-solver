import { Locale } from '@scrabble-solver/types';

export const guessLocale = (): Locale => {
  if (!globalThis.navigator) {
    return Locale.EN_US;
  }

  const languages = globalThis.navigator.languages;

  if (languages.includes('pl') || languages.includes('pl-PL')) {
    return Locale.PL_PL;
  }

  if (languages.includes('en-GB')) {
    return Locale.EN_GB;
  }

  if (languages.includes('fa') || languages.includes('fa-IR')) {
    return Locale.FA_IR;
  }

  if (languages.includes('fr-FR')) {
    return Locale.FR_FR;
  }

  if (languages.includes('ro') || languages.includes('ro-RO')) {
    return Locale.RO_RO;
  }

  const locales = Object.values(Locale);
  const exactMatch = locales.find((locale) => globalThis.navigator.language === String(locale));

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = locales.find((locale) => {
    return globalThis.navigator.language === locale.substring(0, 2);
  });

  return partialMatch ?? Locale.EN_US;
};
