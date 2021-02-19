import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition } from '../lib';
import { ParseResult } from '../types';

const parsePolish = (html: string, word: string): ParseResult => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();

  return {
    definitions: $definitions.text().trim().split(/\d+\./),
    isAllowed: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
  };
};

export default parsePolish;
