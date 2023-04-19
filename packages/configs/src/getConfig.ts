import { Config, Locale } from '@scrabble-solver/types';

import * as locales from './locales';

const getConfig = (configId: string, locale: Locale): Config => {
  const configs = Object.values(locales).flat();
  const localeConfig = configs.find((config) => config.id === configId && config.locale === locale);

  if (typeof localeConfig === 'undefined') {
    throw new Error(`No game for "${configId}" in "${locale}"`);
  }

  return localeConfig;
};

export default getConfig;
