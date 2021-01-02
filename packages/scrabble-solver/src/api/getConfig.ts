import { configs } from '@scrabble-solver/configs';
import { Config } from '@scrabble-solver/models';

import { Locale } from 'types';

const getConfig = (configId: string, locale: Locale): Config => {
  const config = configs.find(({ id }) => id === configId);

  if (!config) {
    throw new Error(`Invalid "configId" parameter: not one of ${configs.map(({ id }) => id).join('/')}`);
  }

  return config[locale];
};

export default getConfig;
