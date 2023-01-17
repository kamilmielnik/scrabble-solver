import { load } from 'cheerio';

import { ParseResult } from '../types';

const DOES_NOT_EXIST_MESSAGE = '404 Page Not Found';

const parseFarsi = (html: string): ParseResult => {
  const $ = load(html);
  const $definitions = $('[itemprop=articleBody]');

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text()),
    exists: $('#container h1').text() !== DOES_NOT_EXIST_MESSAGE,
  };
};

export default parseFarsi;
