import { Locale } from '@scrabble-solver/types';

const PREFERRED_LOCALES = [
  { languages: ['pl', 'pl-PL'], locale: Locale.PL_PL },
  { languages: ['en-GB'], locale: Locale.EN_GB },
  { languages: ['fa', 'fa-IR'], locale: Locale.FA_IR },
  { languages: ['fr-FR'], locale: Locale.FR_FR },
  { languages: ['ro', 'ro-RO'], locale: Locale.RO_RO },
  { languages: ['ca', 'ca-ES'], locale: Locale.CA_ES },
];

export const guessLocale = (): Locale => {
  if (!globalThis.navigator) {
    return Locale.EN_US;
  }

  const languages = globalThis.navigator.languages;

  const preferredLocale = PREFERRED_LOCALES.find((preferred) => {
    return preferred.languages.some((language) => languages.includes(language));
  });

  if (preferredLocale) {
    return preferredLocale.locale;
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
