import { BLANK } from '@scrabble-solver/constants';
import { Config, Locale } from '@scrabble-solver/types';

export const extractRack = (config: Config, value: string): (string | null)[] => {
  const charactersByCase = extractCharacters(config, value);
  const characters = Array.from({ length: config.rackSize }, (_, index) => {
    return typeof charactersByCase[index] === 'string' ? charactersByCase[index] : null;
  });
  return characters;
};

export const extractCharacters = (config: Config, value: string): string[] => {
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

const isUpperCase = (locale: Locale, value: string): boolean => {
  return value === value.toLocaleUpperCase(locale);
};
