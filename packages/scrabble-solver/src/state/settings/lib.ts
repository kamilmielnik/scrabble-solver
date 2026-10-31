import { Locale } from '@scrabble-solver/types';

const LOCALES = Object.values(Locale);

// Canada plays the North American word list, like the US
const REGIONAL_LOCALES: Record<string, Locale> = { 'en-CA': Locale.EN_US };

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
  const regionalMatch = Object.entries(REGIONAL_LOCALES).find(([region]) => belongsToLanguage(tag, region))?.[1];
  const partialMatch = LOCALES.find((locale) => belongsToLanguage(tag, locale.substring(0, 2)));

  return exactMatch ?? regionalMatch ?? partialMatch;
}

function belongsToLanguage(tag: string, language: string): boolean {
  return tag === language || tag.startsWith(`${language}-`);
}
