import { Config } from '@scrabble-solver/models';

import configs from './configs';

interface Result {
  id: string;
  name: string;
  'en-GB': Config;
  'en-US': Config;
  'pl-PL': Config;
  'fr-FR': Config;
}

const getConfig = (configId: string): Result => {
  const config = configs.find(({ id }) => id === configId);

  if (!config) {
    throw new Error(`Invalid "configId" parameter: not one of ${configs.map(({ id }) => id).join('/')}`);
  }

  return config;
};

export default getConfig;
