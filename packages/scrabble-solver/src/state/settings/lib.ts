import { Locale } from '@scrabble-solver/types';

const DEFAULT_LOCALE = Locale.EN_US;

const LOCALES = Object.values(Locale);

// Canada plays the North American word list, like the US
const REGIONAL_LOCALES: Record<string, Locale> = { 'en-CA': Locale.EN_US };

export function guessLocale(): Locale {
  if (!globalThis.navigator) {
    return DEFAULT_LOCALE;
  }

  const { language, languages } = globalThis.navigator;

  for (const tag of [...languages, language]) {
    const locale = findLocale(tag);

    if (locale) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

function findLocale(tag: string): Locale | undefined {
  const exactMatch = LOCALES.find((locale) => tag === String(locale));
  const regionalMatch = Object.entries(REGIONAL_LOCALES).find(([region]) => belongsToLanguage(tag, region))?.[1];
  const defaultMatch = tag === getLanguage(DEFAULT_LOCALE) ? DEFAULT_LOCALE : undefined;
  const partialMatch = LOCALES.find((locale) => belongsToLanguage(tag, getLanguage(locale)));

  return exactMatch ?? regionalMatch ?? defaultMatch ?? partialMatch;
}

function getLanguage(locale: Locale): string {
  return locale.substring(0, 2);
}

function belongsToLanguage(tag: string, language: string): boolean {
  return tag === language || tag.startsWith(`${language}-`);
}
