import { Locale, WordDefinition } from '@scrabble-solver/types';

import getEnglishWordDefinition from './getEnglishWordDefinition';
import getFrenchWordDefinition from './getFrenchWordDefinition';
import getPolishWordDefinition from './getPolishWordDefinition';

const getWordDefinitionPerLocale: Record<Locale, (word: string) => Promise<WordDefinition>> = {
  [Locale.EN_GB]: getEnglishWordDefinition,
  [Locale.EN_US]: getEnglishWordDefinition,
  [Locale.FR_FR]: getFrenchWordDefinition,
  [Locale.PL_PL]: getPolishWordDefinition,
};

const getWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const getLocaleWordDefinition = getWordDefinitionPerLocale[locale];
  return getLocaleWordDefinition(word);
};

export default getWordDefinition;
