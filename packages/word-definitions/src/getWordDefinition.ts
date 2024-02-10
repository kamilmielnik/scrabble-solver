import { Locale, WordDefinition } from '@scrabble-solver/types';

import { crawl } from './crawl';
import { parse } from './parse';

export const getWordDefinition = async (locale: Locale, word: string, isAllowed: boolean): Promise<WordDefinition> => {
  const html = await crawl(locale, word);
  const { definitions, exists } = parse(locale, html);
  const wordDefinition = new WordDefinition({ definitions, exists, isAllowed, word });
  return wordDefinition;
};
