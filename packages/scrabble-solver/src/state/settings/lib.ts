import { Locale } from '@scrabble-solver/types';

const DEFAULT_LOCALE = Locale.EN_US;

const LOCALES = Object.values(Locale);

// The US, its territories and Canada play the North American word list, the rest of the world plays Collins
const NORTH_AMERICAN_REGIONS = ['AS', 'CA', 'GU', 'MP', 'PR', 'UM', 'US', 'VI'];

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
  const parsedTag = parseTag(tag);

  if (!parsedTag) {
    return undefined;
  }

  if (parsedTag.language === 'en') {
    return findEnglishLocale(parsedTag.region);
  }

  return LOCALES.find((locale) => getLanguage(locale) === parsedTag.language);
}

function findEnglishLocale(region: string | undefined): Locale {
  if (typeof region === 'undefined' || NORTH_AMERICAN_REGIONS.includes(region)) {
    return Locale.EN_US;
  }

  return Locale.EN_GB;
}

function parseTag(tag: string): Intl.Locale | undefined {
  try {
    return new Intl.Locale(tag);
  } catch {
    return undefined;
  }
}

function getLanguage(locale: Locale): string {
  return locale.substring(0, 2);
}
