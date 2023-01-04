import { Cheerio, CheerioAPI, Element, load } from 'cheerio';

import { ParseResult } from '../types';

const parseGerman = (html: string): ParseResult => {
  const $ = load(html);

  const definitions = [parseBedeutungsubersicht, parseBedeutungen, parseBedeutung].reduce<string[]>(
    (results, parse) => (results.length === 0 ? parse($) : results),
    [],
  );
  const exists = Array.from($('.label-danger')).every((label) => $(label).text() !== 'Hinweis');

  return { definitions, exists };
};

const parseBedeutungsubersicht = ($: CheerioAPI): string[] => {
  Array.from($('.bedeutungsuebersicht ol > li > a')).forEach((item) => {
    $(item).text($(item).text().replace(/\n/g, ''));
  });

  Array.from($('.bedeutungsuebersicht ol > li > ol > li')).forEach((item) => {
    const text = `\n${$(item).text().replace(/\n/g, '')}`;
    const $text = $(`<div>${text}</div>`);
    $(item).replaceWith($text);
  });

  Array.from($('.bedeutungsuebersicht ol > li > ol')).forEach((list) => {
    const $list = $(list);
    const html = $list.html() || '';
    const $html = $(`<div>${html}</div>`);
    const $prev = $list.prev('a');

    if ($prev) {
      $prev.append($html);
      $(list).remove();
    } else {
      $(list).replaceWith($html);
    }
  });

  return parseDefinitions($, $('.bedeutungsuebersicht ol > li'));
};

const parseBedeutung = ($: CheerioAPI): string[] => {
  return parseDefinitions($, $('.dwdswb-lesart .dwdswb-definition-spezifizierung'));
};

const parseBedeutungen = ($: CheerioAPI): string[] => {
  const definitions = parseDefinitions($, $('.dwdswb-lesart .dwdswb-definition'));

  if (definitions.length > 0) {
    return definitions;
  }

  const $references = $('.dwdswb-lesart .dwdswb-verweis');
  const references = Array.from($references).reduce<string[]>((result, reference) => {
    const html = reference.attribs['data-content'] || '<span />';
    const values = $(html)
      .text()
      .split(';')
      .map((value) => value.trim());

    return result.concat(values);
  }, []);

  return references;
};

const parseDefinitions = ($: CheerioAPI, $definitions: Cheerio<Element>) => {
  return Array.from($definitions).map((definition) =>
    $(definition)
      .text()
      .replace(/[ ]+/g, ' ')
      .replace(/[ ]\n/g, '\n')
      .replace(/^[0-9]+\.\s/g, ''),
  );
};

export default parseGerman;
