import { WordDefinition } from '@scrabble-solver/models';

import { Locale } from 'types';

const findWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const url = `/api/dictionary/${locale}/${word}`;
  const json = await fetch(url).then((response) => response.json());
  return WordDefinition.fromJson(json);
};

export default findWordDefinition;
