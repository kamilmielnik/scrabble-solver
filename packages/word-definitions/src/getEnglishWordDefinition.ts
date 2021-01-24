import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition, request } from './lib';

const getWordDefinition = async (word: string): Promise<WordDefinition> => {
  const locale = 'en';
  const response = await request({
    protocol: 'https',
    hostname: `${locale}.wiktionary.org`,
    path: `/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(word)}`,
  });
  const html = parseResponse(response);
  const wordDefinition = parseHtml(html, word);
  return wordDefinition;
};

const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

interface Response {
  batchcomplete: string;
  warnings: {
    extracts: {
      '*': string;
    };
  };
  query: {
    pages: Record<
      string,
      {
        pageid: number;
        ns: number;
        title: string;
        extract: string;
      }
    >;
  };
}

const parseResponse = (response: string): string => {
  const json = JSON.parse(response) as Response;
  const pages = json.query.pages;
  const keys = Object.keys(pages);
  const key = keys[0];

  if (typeof key === 'undefined') {
    return '';
  }

  return pages[key].extract;
};

export const parseHtml = (html: string, word: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $definitions = $('h4 + p + ol:first-of-type > li');
  $('h4 + p + ol:first-of-type > li ul,ol,dl,.HQToggle').remove();
  const definitions = Array.from($definitions)
    .map((definition) => $(definition).text())
    .map(normalizeDefinition)
    .filter(Boolean);
  const wordDefinition = new WordDefinition({
    definitions: unique(definitions),
    isAllowed: definitions.length > 0,
    word,
  });
  return wordDefinition;
};

export default getWordDefinition;
