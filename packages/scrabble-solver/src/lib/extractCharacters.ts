import { BLANK } from '@scrabble-solver/constants';
import { type Config, type Locale } from '@scrabble-solver/types';

import { localeTransliterate } from './localeTransliterate';

interface Options {
  keepDigraphParts?: boolean;
  upperCaseDigraphsOnly?: boolean;
}

export const extractCharacters = (config: Config, value: string, options?: Options): string[] => {
  let index = 0;
  const characters: string[] = [];
  const finalValue = localeTransliterate(config.locale, value);
  const longestFirstDigraphs = [...config.digraphs].sort((digraphA, digraphB) => digraphB.length - digraphA.length);

  while (index < finalValue.length) {
    const digraph = findLeadingDigraph(config, longestFirstDigraphs, finalValue.substring(index), options);

    if (digraph) {
      characters.push(digraph);
      index += digraph.length;
      continue;
    }

    const character = finalValue[index].toLocaleLowerCase(config.locale);
    const isDigraphPart = options?.keepDigraphParts && config.isDigraphPart(character);

    if (config.hasCharacter(character) || character === BLANK || isDigraphPart) {
      characters.push(character);
    }

    ++index;
  }

  return characters;
};

function findLeadingDigraph(config: Config, digraphs: string[], value: string, options?: Options): string | undefined {
  return digraphs.find((digraph) => {
    const candidate = value.substring(0, digraph.length);
    const isSpelled = candidate.toLocaleLowerCase(config.locale) === digraph;

    return isSpelled && (!options?.upperCaseDigraphsOnly || isUpperCase(config.locale, candidate));
  });
}

const isUpperCase = (locale: Locale, value: string): boolean => {
  return value === value.toLocaleUpperCase(locale);
};
