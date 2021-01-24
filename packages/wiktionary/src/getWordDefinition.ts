import { WordDefinition } from '@scrabble-solver/types';

import { request } from './lib';
import parseResponse from './parseResponse';
import { Locale } from './types';

const getWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const response = await request({
    protocol: 'https',
    hostname: `${locale}.wiktionary.org`,
    path: `/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(word)}`,
  });
  const wordDefinition = parseResponse(response, word);
  return wordDefinition;
};

export default getWordDefinition;
