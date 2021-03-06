import cheerio from 'cheerio';

import { ParseResult } from '../types';

const parseFrench = (html: string): ParseResult => {
  const $ = cheerio.load(html);
  const $definitions = $('.tlf_cdefinition');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    isAllowed: $('#vitemselected span').length > 0,
  };
};

export default parseFrench;
