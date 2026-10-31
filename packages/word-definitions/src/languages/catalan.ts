import { load } from 'cheerio';

import { request, unique } from '../lib';
import type { ParsingResult } from '../types';

interface SearchPayload {
  query?: {
    search?: { title: string }[];
  };
}

const HOSTNAME = 'ca.wiktionary.org';
const HEADERS = { 'User-Agent': 'scrabble-solver (https://github.com/kamilmielnik/scrabble-solver)' };
const MAX_PAGES_COUNT = 4;
const SEARCH_RESULTS_COUNT = 10;

// Every combining mark except the cedilla, which makes "ç" a separate letter.
const STRIPPED_COMBINING_MARKS = /[\u0300-\u0326\u0328-\u036f]/g;

/**
 * Words are stored without accents, like on Scrabble tiles, but Wiktionary titles have them: "canço" is "cançó".
 * One word can stand for many titles ("catorze", "catorzè"), so search for them first and read all of them.
 */
export const crawl = async (word: string): Promise<string> => {
  const titles = await findTitles(word);
  const pages = await Promise.all(titles.map(crawlPage));
  return pages.join('\n');
};

export const parse = (html: string): ParsingResult => {
  const $ = load(html);
  const $sections = $('[id="Català"]').parent('section');
  $sections.find('ol li :is(dl, ol, ul), link, style').remove();
  const definitions = Array.from($sections.find('ol > li')).map((definition) => $(definition).text().trim());

  return {
    definitions,
    exists: definitions.length > 0,
  };
};

async function findTitles(word: string): Promise<string[]> {
  const search = await request({
    protocol: 'https',
    hostname: HOSTNAME,
    path: `/w/api.php?action=query&list=search&format=json&srnamespace=0&srprop=&srlimit=${SEARCH_RESULTS_COUNT}&srsearch=${encodeURIComponent(`intitle:${word}`)}`,
    headers: HEADERS,
  });
  const titles = readTitles(search).filter((title) => stripAccents(title) === stripAccents(word));

  return unique([word, ...titles]).slice(0, MAX_PAGES_COUNT);
}

function crawlPage(title: string): Promise<string> {
  return request({
    protocol: 'https',
    hostname: HOSTNAME,
    path: `/w/rest.php/v1/page/${encodeURIComponent(title)}/html`,
    headers: HEADERS,
  });
}

function readTitles(json: string): string[] {
  try {
    const { query }: SearchPayload = JSON.parse(json);
    return (query?.search ?? []).map(({ title }) => title);
  } catch {
    return [];
  }
}

function stripAccents(word: string): string {
  return word.normalize('NFD').replace(STRIPPED_COMBINING_MARKS, '').normalize('NFC');
}
