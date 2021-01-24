import { WordDefinition } from '@scrabble-solver/types';

import { WiktionaryResponse } from './types';
import parseResponseHtml from './parseResponseHtml';

const parseResponse = (response: string, word: string): WordDefinition => {
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

export default parseResponse;
