import { Locale, WordDefinition } from '@scrabble-solver/types';

import crawl from './crawl';
import parse from './parse';

const getWordDefinition = async (locale: Locale, word: string): Promise<WordDefinition> => {
  const html = await crawl(locale, word);
  const { definitions, isAllowed } = parse(locale, html);
  const wordDefinition = new WordDefinition({
    definitions: Array.from(new Set(Array.from(definition).map(normalizeDefinition).filter(Boolean))),
    isAllowed,
    word,
  });
  return wordDefinition;
};

export default getWordDefinition;
