import { load } from 'cheerio';

import { ParseResult } from '../types';

const parseEnglish = (html: string): ParseResult => {
  const $ = load(html);
  $('strong.mw_t_bc').replaceWith(', ');
  $('.text-lowercase').remove();
  $('[id^=dictionary-entry]').find('.dtText > *:not(a)').remove();
  const $definitions = $('[id^=dictionary-entry]').find('.dtText, .cxl-ref');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    isAllowed: $definitions.length > 0,
  };
};

export default parseEnglish;
