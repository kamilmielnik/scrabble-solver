import { load } from 'cheerio';

import { request } from '../lib';
import { ParsingResult } from '../types';

const DOES_NOT_EXIST_MESSAGE = '404 Page Not Found';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.vajehyab.com',
    path: `/moein/${encodeURIComponent(word)}`,
  });
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);
  const $definitions = $('[itemprop=articleBody]');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    exists: $('#container h1').text() !== DOES_NOT_EXIST_MESSAGE,
  };
};
