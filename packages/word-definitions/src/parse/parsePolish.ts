import { load } from 'cheerio';

import type { ParseResult } from '../types';

const parsePolish = (html: string): ParseResult => {
  const $ = load(html);
  const $header = $($('h1')[0]);
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();

  return {
    definitions: $definitions.text().trim().split(/\d+\./u),
    exists: $isAllowed.text().trim().includes('dopuszczalne w grach'),
  };
};

export default parsePolish;
