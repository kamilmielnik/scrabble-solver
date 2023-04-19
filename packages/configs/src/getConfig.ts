import { Config, Game, Locale } from '@scrabble-solver/types';

import * as locales from './locales';

const getConfig = (game: Game, locale: Locale): Config => {
  const configs = Object.values(locales).flat();
  const localeConfig = configs.find((config) => config.game === game && config.locale === locale);

  if (typeof localeConfig === 'undefined') {
    throw new Error(`No game "${game}" in "${locale}"`);
  }

  return localeConfig;
};

export default getConfig;
