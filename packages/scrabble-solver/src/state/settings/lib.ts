import { Locale } from '@scrabble-solver/types';

const PREFERRED_LOCALES = [
  { language: 'pl', locale: Locale.PL_PL },
  { language: 'en-GB', locale: Locale.EN_GB },
  { language: 'fa', locale: Locale.FA_IR },
  { language: 'fr-FR', locale: Locale.FR_FR },
  { language: 'ro', locale: Locale.RO_RO },
  { language: 'ca', locale: Locale.CA_ES },
];

export function guessLocale(): Locale {
  if (!globalThis.navigator) {
    return Locale.EN_US;
  }

  const { language, languages } = globalThis.navigator;

  const preferredLocale = PREFERRED_LOCALES.find((preferred) => {
    return languages.some((tag) => belongsToLanguage(tag, preferred.language));
  });

  if (preferredLocale) {
    return preferredLocale.locale;
  }

  const locales = Object.values(Locale);
  const exactMatch = locales.find((locale) => language === String(locale));
  const partialMatch = locales.find((locale) => belongsToLanguage(language, locale.substring(0, 2)));

  return exactMatch ?? partialMatch ?? Locale.EN_US;
}

function belongsToLanguage(tag: string, language: string): boolean {
  return tag === language || tag.startsWith(`${language}-`);
}
