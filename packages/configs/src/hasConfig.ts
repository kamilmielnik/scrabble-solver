import { Game, Locale } from '@scrabble-solver/types';

import * as locales from './locales';

const hasConfig = (game: Game, locale: Locale): boolean => {
  const configs = Object.values(locales).flat();
  return configs.some((config) => config.game === game && config.locale === locale);
};

export default hasConfig;
