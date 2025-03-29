import { BLANK } from '@scrabble-solver/constants';
import { Config } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

export const extractCharacters = (config: Config, value: string): string[] => {
  let index = 0;
  const characters: string[] = [];
  const valueLowercase = localeTransliterate(config.locale, value.toLocaleLowerCase(config.locale));

  while (index < valueLowercase.length) {
    const character = valueLowercase[index];
    const nextCharacter = valueLowercase[index + 1];
    const digraph = `${character}${nextCharacter}`;

    if (config.twoCharacterTiles.includes(digraph)) {
      characters.push(digraph);
      index += digraph.length;
    } else if (config.hasCharacter(character) || character === BLANK) {
      characters.push(character);
      ++index;
    } else {
      ++index;
    }
  }

  return characters;
};
