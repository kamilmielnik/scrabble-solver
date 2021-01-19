import { isConfigId } from '@scrabble-solver/configs';

const validateConfigId = (configId: unknown): void => {
  if (!isConfigId(configId)) {
    throw new Error('Invalid "configId" parameter');
  }
};

export default validateConfigId;
