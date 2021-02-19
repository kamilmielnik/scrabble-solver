import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition } from '../lib';
import { ParseResult } from '../types';

const parseEnglish = (html: string): ParseResult => {
  const $ = cheerio.load(html);
  $('[id^=dictionary-entry]').find('.dtText *').remove();
  const $definitions = $('[id^=dictionary-entry]').find('.dtText, .cxl-ref');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    isAllowed: $definitions.length > 0,
  };
};

export default parseEnglish;
