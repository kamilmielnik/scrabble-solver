import { load } from 'cheerio';

import { ParseResult } from '../types';

const parsePolish = (html: string): ParseResult => {
  const $ = load(html);
  const $header = $($('h1')[0]);
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();

  return {
    definitions: $definitions.text().trim().split(/\d+\./),
    isAllowed: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
  };
};

export default parsePolish;
