import { Locale } from '@scrabble-solver/types';

const LOCALES = Object.values(Locale);

export function guessLocale(): Locale {
  if (!globalThis.navigator) {
    return Locale.EN_US;
  }

  const { language, languages } = globalThis.navigator;

  for (const tag of [...languages, language]) {
    const locale = findLocale(tag);

    if (locale) {
      return locale;
    }
  }

  return Locale.EN_US;
}

function findLocale(tag: string): Locale | undefined {
  const exactMatch = LOCALES.find((locale) => tag === String(locale));
  const partialMatch = LOCALES.find((locale) => belongsToLanguage(tag, locale.substring(0, 2)));

  return exactMatch ?? partialMatch;
}

function belongsToLanguage(tag: string, language: string): boolean {
  return tag === language || tag.startsWith(`${language}-`);
}
