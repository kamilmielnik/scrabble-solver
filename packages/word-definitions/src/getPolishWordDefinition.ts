import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition, request } from './lib';

const getPolishWordDefinition = async (word: string): Promise<WordDefinition> => {
  const response = await request({
    protocol: 'https',
    hostname: 'sjp.pl',
    path: `/${encodeURIComponent(word)}`,
  });
  const wordDefinition = parsepResponse(response);
  return wordDefinition;
};

const parsepResponse = (html: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $word = $header.next().next();
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();
  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set($definitions.text().trim().split(/\d+\./).map(normalizeDefinition).filter(Boolean)),
    ),
    isAllowed: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
    word: $word.text().trim(),
  });
  return wordDefinition;
};

export default getPolishWordDefinition;
