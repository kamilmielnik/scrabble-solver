import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.cnrtl.fr',
    path: `/definition/${encodeURIComponent(word)}`,
  });
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);
  const $definitions = $('.tlf_cdefinition');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    exists: $('#vitemselected span').length > 0,
  };
};
