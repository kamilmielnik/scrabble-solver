import { Locale, WordDefinition } from '@scrabble-solver/types';

const findWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const url = `/api/dictionary/${locale}/${word}`;
  const json = await fetch(url).then((response) => response.json());
  return WordDefinition.fromJson(json);
};

export default findWordDefinition;
