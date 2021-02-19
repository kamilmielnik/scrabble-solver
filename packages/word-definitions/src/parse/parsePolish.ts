import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition } from '../lib';

const parsePolish = (html: string): WordDefinition => {
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

export default parsePolish;
