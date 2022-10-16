import { Locale, WordDefinition, WordDefinitionJson } from '@scrabble-solver/types';

import fetchJson from './fetchJson';

const findWordDefinitions = async (locale: Locale, word: string): Promise<WordDefinition[]> => {
  const json = await fetchJson<WordDefinitionJson[]>(`/api/dictionary/${locale}/${word}`);
  return json.map(WordDefinition.fromJson);
};

export default findWordDefinitions;
