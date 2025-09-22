import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'dexonline.ro',
    path: `/definitie/${encodeURIComponent(word)}`,
  });
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);

  const $activeTab = $('.tab-pane.show.active');
  $('.type-example').remove();
  const $definitions = $activeTab.find('li.type-meaning.depth-0 > .meaningContainer .tree-def.html');
  $definitions.find('.meaningTree').remove();
  const definitions = Array.from($definitions).map((definition) => $(definition).text().replace(/\n/g, ''));

  return {
    definitions,
    exists: definitions.length > 0,
  };
};
