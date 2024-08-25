import { load } from 'cheerio';

import { request } from '../lib';
import { ParsingResult } from '../types';

const DOES_NOT_EXIST_MESSAGE = 'Aradığınız kelime sözlükte bulunamadı.';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'sozluk.gov.tr',
    path: `/gts?ara=${encodeURIComponent(word)}`,
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
