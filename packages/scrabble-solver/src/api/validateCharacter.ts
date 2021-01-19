import { BLANK } from '@scrabble-solver/constants';
import { Config } from '@scrabble-solver/types';

const validateCharacter = (character: unknown, config: Config): void => {
  if (typeof character !== 'string') {
    throw new Error('character is not a string');
  }

  if (!config.hasCharacter(character) && character !== BLANK) {
    throw new Error('character is not valid');
  }
};

export default validateCharacter;
