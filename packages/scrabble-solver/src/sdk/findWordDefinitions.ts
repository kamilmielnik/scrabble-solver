import { Locale, WordDefinition } from '@scrabble-solver/types';

const findWordDefinitions = async (locale: Locale, word: string): Promise<WordDefinition[]> => {
  const url = `/api/dictionary/${locale}/${word}`;
  const json = await fetch(url).then((response) => response.json());
  return json.map(WordDefinition.fromJson);
};

export default findWordDefinitions;
