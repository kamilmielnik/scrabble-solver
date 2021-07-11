import cheerio from 'cheerio';

import { ParseResult } from '../types';

const parseSpanish = (html: string): ParseResult => {
  const $ = cheerio.load(html);
  $('#resultados p[class^="j"] span').remove();
  $('#resultados p[class^="j"] abbr').remove();
  const $definitions = $('#resultados p[class^="j"]');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    isAllowed: $definitions.length > 0,
  };
};

export default parseSpanish;
