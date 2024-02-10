import { Game, Locale } from '@scrabble-solver/types';

import * as languages from './languages';

export const hasConfig = (game: Game, locale: Locale): boolean => {
  const configs = Object.values(languages);
  return configs.some((config) => config.game === game && config.locale === locale);
};
