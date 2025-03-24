import { BLANK } from '@scrabble-solver/constants';
import { Config } from '@scrabble-solver/types';

import { isUpperCase } from './isUpperCase';

export const extractCharactersByCase = (config: Config, value: string): string[] => {
  let index = 0;
  const characters: string[] = [];

  while (index < value.length) {
    const character = value[index];
    const characterLowercase = value[index].toLocaleLowerCase(config.locale);
    const nextCharacter = value[index + 1];
    const digraph = `${character}${nextCharacter}`;
    const digraphLowercase = digraph.toLocaleLowerCase(config.locale);

    if (isUpperCase(config.locale, digraph) && config.twoCharacterTiles.includes(digraphLowercase)) {
      characters.push(digraphLowercase);
      index += digraphLowercase.length;
    } else if (config.hasCharacter(characterLowercase) || characterLowercase === BLANK) {
      characters.push(characterLowercase);
      ++index;
    } else {
      ++index;
    }
  }

  return characters;
};
