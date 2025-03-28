import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

const DOES_NOT_EXIST_MESSAGE =
  // eslint-disable-next-line max-len
  "The word you've entered isn't in the dictionary. Click on a spelling suggestion below or try again using the search bar above.";

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.merriam-webster.com',
    path: `/dictionary/${encodeURIComponent(word)}`,
  });
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);
  $('strong.mw_t_bc').replaceWith(', ');
  $('.text-lowercase').remove();
  $('.sub-content-thread').remove();

  const $definitions = $('[id^=dictionary-entry]').find('.dtText, .cxl-ref');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text().replace(/\n/g, '')),
    exists: $('.spelling-suggestion-text').text().trim() !== DOES_NOT_EXIST_MESSAGE,
  };
};
