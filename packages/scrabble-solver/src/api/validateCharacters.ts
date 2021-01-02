import { Config } from '@scrabble-solver/models';

import validateCharacter from './validateCharacter';

const validateCharacters = (characters: unknown, config: Config): void => {
  if (!Array.isArray(characters)) {
    throw new Error('Invalid "characters" parameter: not an array');
  }

  if (characters.length === 0) {
    throw new Error('Invalid "characters" parameter: empty array');
  }

  characters.forEach((character, characterIndex) => {
    try {
      validateCharacter(character, config);
    } catch (error) {
      throw new Error(`Invalid "characters" parameter: characters[${characterIndex}] ${error.message}`);
    }
  });
};

export default validateCharacters;
