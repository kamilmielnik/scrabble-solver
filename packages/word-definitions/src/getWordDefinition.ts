import { Locale, WordDefinition } from '@scrabble-solver/types';

import crawl from './crawl';
import parse from './parse';

const getWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const html = await crawl(locale, word);
  const wordDefinition = parse(locale, html, word);
  return wordDefinition;
};

export default getWordDefinition;
