import { load } from 'cheerio';

import { ParseResult } from '../types';

const DOES_NOT_EXIST_MESSAGE =
  // eslint-disable-next-line max-len
  "The word you've entered isn't in the dictionary. Click on a spelling suggestion below or try again using the search bar above.";

const parseEnglish = (html: string): ParseResult => {
  const $ = load(html);
  $('strong.mw_t_bc').replaceWith(', ');
  $('.text-lowercase').remove();
  $('[id^=dictionary-entry]').find('.dtText > *:not(a)').remove();
  const $definitions = $('[id^=dictionary-entry]').find('.dtText, .cxl-ref');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text().replace(/\n/g, '')),
    exists: $('.spelling-suggestion-text').text().trim() !== DOES_NOT_EXIST_MESSAGE,
  };
};

export default parseEnglish;
