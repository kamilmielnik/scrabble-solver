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
 * One word can stand for many titles ("catorze", "catorzè"), so search for them while reading the page of the word.
 * Up to MAX_PAGES_COUNT pages are read, the word itself takes one of these, and a title outside the top
 * SEARCH_RESULTS_COUNT results is missed. A page that fails is left out; only a word whose every page fails rejects.
 */
export async function crawl(word: string): Promise<string> {
  const [wordPage, accentedPages] = await Promise.allSettled([crawlPage(word), crawlAccentedPages(word)]);
  const pages = [wordPage, ...(accentedPages.status === 'fulfilled' ? accentedPages.value : [])];
  const contents = pages.filter((page) => page.status === 'fulfilled').map((page) => page.value);

  if (contents.length === 0 && wordPage.status === 'rejected') {
    throw wordPage.reason;
  }

  return contents.join('\n');
}

export function parse(html: string): ParsingResult {
  const $ = load(html);
  const $sections = $('[id="Català"]').parent('section');
  $sections.find('ol li :is(dl, ol, ul), link, style').remove();
  const definitions = Array.from($sections.find('ol > li')).map((definition) => $(definition).text().trim());

  return {
    definitions,
    exists: definitions.length > 0,
  };
}

async function crawlAccentedPages(word: string): Promise<PromiseSettledResult<string>[]> {
  const titles = await findAccentedTitles(word);
  return Promise.allSettled(titles.map(crawlPage));
}

async function findAccentedTitles(word: string): Promise<string[]> {
  const search = await request({
    protocol: 'https',
    hostname: HOSTNAME,
    path: `/w/api.php?action=query&list=search&format=json&srnamespace=0&srprop=&srlimit=${SEARCH_RESULTS_COUNT}&srsearch=${encodeURIComponent(`intitle:${word}`)}`,
    headers: HEADERS,
  });
  const titles = readTitles(search).filter((title) => title !== word && stripAccents(title) === stripAccents(word));

  return unique(titles).slice(0, MAX_PAGES_COUNT - 1);
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
