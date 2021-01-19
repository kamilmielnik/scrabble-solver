import literaki from './literaki';
import scrabble from './scrabble';

const configs = [literaki, scrabble];

const isConfigId = (configId: unknown): boolean => {
  return configs.some(({ id }) => id === configId);
};

export default isConfigId;
