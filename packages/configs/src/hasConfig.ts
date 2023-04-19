import { Locale } from '@scrabble-solver/types';

import * as locales from './locales';

const hasConfig = (configId: string, locale: Locale): boolean => {
  const configs = Object.values(locales).flat();
  return configs.some((config) => config.id === configId && config.locale === locale);
};

export default hasConfig;
