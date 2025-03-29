import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'sjp.pl',
    path: `/${encodeURIComponent(word)}`,
  });
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);
  const $header = $($('h1')[0]);
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();

  return {
    definitions: $definitions.text().trim().split(/\d+\./),
    exists: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
  };
};
