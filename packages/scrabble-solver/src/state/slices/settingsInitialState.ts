import { scrabble } from '@scrabble-solver/configs';
import { Locale } from '@scrabble-solver/types';

const getInitialLocale = (): Locale => {
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

const settingsInitialState = {
  autoGroupTiles: 'left' as 'left' | 'right' | null,
  configId: scrabble.id,
  locale: getInitialLocale(),
};

export default settingsInitialState;
