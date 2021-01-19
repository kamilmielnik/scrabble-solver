import { Config } from '@scrabble-solver/types';

import validateCharacter from './validateCharacter';

const validateTile = (tile: unknown, config: Config): void => {
  if (typeof tile !== 'object') {
    throw new Error('is not an object');
  }

  if (tile !== null) {
    const { character, isBlank } = tile as Record<string, unknown>;

    validateCharacter(character, config);

    if (typeof isBlank !== 'boolean') {
      throw new Error('isBlank is not a boolean');
    }
  }
};

export default validateTile;
