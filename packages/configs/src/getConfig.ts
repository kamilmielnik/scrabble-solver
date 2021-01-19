import { Config } from '@scrabble-solver/models';

import configs from './configs';

interface Result {
  id: string;
  name: string;
  'en-GB': Config;
  'en-US': Config;
  'fr-FR': Config;
  'pl-PL': Config;
}

const getConfig = (configId: string): Result => {
  const config = configs.find(({ id }) => id === configId);

  if (!config) {
    throw new Error(`Invalid "configId" parameter: not one of ${configs.map(({ id }) => id).join('/')}`);
  }

  return config;
};

export default getConfig;
