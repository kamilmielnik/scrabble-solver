import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition, unique } from './lib';

const parseHtml = (html: string, word: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $definitions = $('h4 + p + ol:first-of-type > li');
  $('h4 + p + ol:first-of-type > li ul,ol,dl,.HQToggle').remove();
  const definitions = Array.from($definitions)
    .map((definition) => $(definition).text())
    .map(normalizeDefinition)
    .filter(Boolean);
  const wordDefinition = new WordDefinition({
    definitions: unique(definitions),
    isAllowed: definitions.length > 0,
    word,
  });
  return wordDefinition;
};

export default parseHtml;
