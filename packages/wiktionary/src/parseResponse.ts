import { WordDefinition } from '@scrabble-solver/types';

import { isPage, isWiktionaryResponse } from './guards';
import parseResponseHtml from './parseResponseHtml';

const parseResponse = (response: string, word: string): WordDefinition => {
  const json = JSON.parse(response);

  if (!isWiktionaryResponse(json)) {
    throw new Error('Cannot parse Wiktionary response');
  }

  const pages = json.query.pages;
  const keys = Object.keys(pages);
  const page = pages[keys[0]];

  if (!isPage(page)) {
    return new WordDefinition({ definitions: [], isAllowed: false, word });
  }

  const wordDefinition = parseResponseHtml(page.extract, word);
  return wordDefinition;
};

export default parseResponse;
