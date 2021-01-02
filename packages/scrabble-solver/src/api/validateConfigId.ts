import { configs } from '@scrabble-solver/configs';

const validateConfigId = (configId: unknown): void => {
  if (!configs.some(({ id }) => id === configId)) {
    throw new Error(`Invalid "configId" parameter: not one of ${configs.map(({ id }) => id).join('/')}`);
  }
};

export default validateConfigId;
