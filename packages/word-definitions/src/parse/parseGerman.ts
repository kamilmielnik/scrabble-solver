import { load } from 'cheerio';

import { ParseResult } from '../types';

const parseGerman = (html: string): ParseResult => {
  const $ = load(html);
  const $meaningOverview = $('.bedeutungsuebersicht');
  let $definitions;
  if ($meaningOverview.length > 0) {
    $definitions = $('.bedeutungsuebersicht > ol > li > a');
  } else {
    $definitions = $('.dwdswb-lesart .dwdswb-definition');
  }

  return {
    definitions: Array.from($definitions).map((definition) => $(definition).text().replace('/\n/', '')),
    isAllowed: $definitions.length > 0,
  };
};

export default parseGerman;
