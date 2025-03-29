import { BLANK } from '@scrabble-solver/constants';
import { Config, Locale } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

interface Options {
  upperCaseDigraphsOnly?: boolean;
}

export const extractCharacters = (config: Config, value: string, options?: Options): string[] => {
  let index = 0;
  const characters: string[] = [];
  const finalValue = localeTransliterate(config.locale, value);

  while (index < finalValue.length) {
    const character = finalValue[index];
    const characterLowercase = character.toLocaleLowerCase(config.locale);
    const nextCharacter = finalValue[index + 1];
    const digraph = `${character}${nextCharacter}`;
    const digraphLowercase = digraph.toLocaleLowerCase(config.locale);

    const isValidDigraph = options?.upperCaseDigraphsOnly
      ? config.twoCharacterTiles.includes(digraphLowercase) && isUpperCase(config.locale, digraph)
      : config.twoCharacterTiles.includes(digraphLowercase);

    if (isValidDigraph) {
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

const isUpperCase = (locale: Locale, value: string): boolean => {
  return value === value.toLocaleUpperCase(locale);
};
