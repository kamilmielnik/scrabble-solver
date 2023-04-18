import * as games from './games';

const configs = Object.values(games).flat();

const isConfigId = (configId: unknown): boolean => {
  return configs.some(({ id }) => id === configId);
};

export default isConfigId;
