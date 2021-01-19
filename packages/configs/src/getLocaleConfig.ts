import { Config, Locale } from '@scrabble-solver/types';

import getConfig from './getConfig';

const getLocaleConfig = (configId: string, locale: Locale): Config => {
  return getConfig(configId)[locale];
};

export default getLocaleConfig;
