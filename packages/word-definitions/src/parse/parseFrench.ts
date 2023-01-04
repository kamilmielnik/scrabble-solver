import { load } from 'cheerio';

import { ParseResult } from '../types';

const parseFrench = (html: string): ParseResult => {
  const $ = load(html);
  const $definitions = $('.tlf_cdefinition');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    exists: $('#vitemselected span').length > 0,
  };
};

export default parseFrench;
