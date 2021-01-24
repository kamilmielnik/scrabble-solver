import { WordDefinition } from '@scrabble-solver/types';

import { request } from './lib';
import { Locale, WiktionaryResponse } from './types';
import parseResponseHtml from './parseResponseHtml';

const getWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const response = await request({
    protocol: 'https',
    hostname: `${locale}.wiktionary.org`,
    path: `/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(word)}`,
  });
  const wordDefinition = parseResponse(response, word);
  return wordDefinition;
};

export const parseResponse = (response: string, word: string): WordDefinition => {
  const json = JSON.parse(response) as WiktionaryResponse;
  const pages = json.query.pages;
  const keys = Object.keys(pages);
  const key = keys[0];

  if (typeof key === 'undefined') {
    return new WordDefinition({ definitions: [], isAllowed: false, word });
  }

  const html = pages[key].extract;
  const wordDefinition = parseResponseHtml(html, word);
  return wordDefinition;
};

export default getWordDefinition;
