import { load } from 'cheerio';

import { ParseResult } from '../types';

const parseRomanian = (html: string): ParseResult => {
  const $ = load(html);

  const $activeTab = $('.tab-pane.show.active');
  $('.type-example').remove();
  const $definitions = $activeTab.find('li.type-meaning.depth-0 > .meaningContainer .def.html');
  $definitions.find('.meaningTree').remove();
  const definitions = Array.from($definitions).map((definition) => $(definition).text().replace(/\n/g, ''));

  return {
    definitions,
    exists: definitions.length > 0,
  };
};

export default parseRomanian;
