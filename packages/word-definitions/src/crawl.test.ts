import { Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as crawlModule from './crawl';
import { normalizeDefinition } from './lib/normalizeDefinition';
import { unique } from './lib/unique';

const request = mock<(options: object) => Promise<string>>();

await mock.module('./lib', () => ({ normalizeDefinition, request, unique }));

const { crawl }: typeof crawlModule = await import('./crawl');

const WIKTIONARY = {
  headers: { 'User-Agent': 'scrabble-solver (https://github.com/kamilmielnik/scrabble-solver)' },
  hostname: 'en.wiktionary.org',
  pathPrefix: '/api/rest_v1/page/definition/',
};
const CNRTL = { hostname: 'www.cnrtl.fr', pathPrefix: '/definition/' };
const DEXONLINE = { hostname: 'dexonline.ro', pathPrefix: '/definitie/' };
const DICCIONARIOS = { hostname: 'www.diccionarios.com', pathPrefix: '/diccionario/espanol/' };
const DWDS = { hostname: 'www.dwds.de', pathPrefix: '/wb/' };
const SJP = { hostname: 'sjp.pl', pathPrefix: '/' };
const TDK = { headers: { 'content-type': 'text/json' }, hostname: 'sozluk.gov.tr', pathPrefix: '/gts?ara=' };
const VAJEHYAB = { hostname: 'www.vajehyab.com', pathPrefix: '/moein/' };

const sources = [
  { encodedWord: 'gr%C3%B6%C3%9Fe', locale: Locale.DE_DE, source: DWDS, word: 'größe' },
  { encodedWord: 'na%C3%AFve', locale: Locale.EN_GB, source: WIKTIONARY, word: 'naïve' },
  { encodedWord: 'caf%C3%A9', locale: Locale.EN_US, source: WIKTIONARY, word: 'café' },
  { encodedWord: '%C3%B1and%C3%BA', locale: Locale.ES_ES, source: DICCIONARIOS, word: 'ñandú' },
  { encodedWord: '%DA%A9%D8%AA%D8%A7%D8%A8', locale: Locale.FA_IR, source: VAJEHYAB, word: 'کتاب' },
  { encodedWord: '%C3%A9t%C3%A9', locale: Locale.FR_FR, source: CNRTL, word: 'été' },
  { encodedWord: '%C5%BC%C3%B3%C5%82%C4%87', locale: Locale.PL_PL, source: SJP, word: 'żółć' },
  { encodedWord: '%C8%9Bar%C4%83', locale: Locale.RO_RO, source: DEXONLINE, word: 'țară' },
  { encodedWord: '%C3%A7%C4%B1%C4%9F', locale: Locale.TR_TR, source: TDK, word: 'çığ' },
];

beforeEach(() => {
  request.mockReset();
  request.mockResolvedValue('body');
});

describe('crawl', () => {
  it.each(sources)(
    '[$locale] requests "$word" from its source over https',
    async ({ encodedWord, locale, source, word }) => {
      await crawl(locale, word);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request.mock.calls[0][0]).toStrictEqual(getExpectedOptions(source, encodedWord));
    },
  );

  it.each(sources)('[$locale] keeps a plain word as it is', async ({ locale, source }) => {
    await crawl(locale, 'word');

    expect(request.mock.calls[0][0]).toStrictEqual(getExpectedOptions(source, 'word'));
  });

  it.each(sources)('[$locale] encodes the characters reserved in a URL', async ({ locale, source }) => {
    await crawl(locale, 'a/b?c#d e&f=g');

    expect(request.mock.calls[0][0]).toStrictEqual(getExpectedOptions(source, 'a%2Fb%3Fc%23d%20e%26f%3Dg'));
  });

  it('keeps the Arabic and the Persian kaf apart', async () => {
    await crawl(Locale.FA_IR, 'كتاب');

    expect(request.mock.calls[0][0]).toStrictEqual(getExpectedOptions(VAJEHYAB, '%D9%83%D8%AA%D8%A7%D8%A8'));
  });

  it.each(sources)('[$locale] resolves with the raw response body', async ({ locale, word }) => {
    request.mockResolvedValue('<html>zażółć</html>');

    expect(await crawl(locale, word)).toBe('<html>zażółć</html>');
  });

  it.each(sources)('[$locale] rejects without a retry when its only source fails', async ({ locale, word }) => {
    const error = new Error('socket hang up');
    request.mockRejectedValue(error);

    expect(await crawl(locale, word).catch(returnError)).toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
});

describe('crawl - Catalan', () => {
  const headers = WIKTIONARY.headers;

  it('searches for the titles of the word, then reads its page', async () => {
    serveWiktionary([], { cases: 'page' });

    await crawl(Locale.CA_ES, 'cases');

    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[0][0]).toStrictEqual({
      headers,
      hostname: 'ca.wiktionary.org',
      path: '/w/api.php?action=query&list=search&format=json&srnamespace=0&srprop=&srlimit=10&srsearch=intitle%3Acases',
      protocol: 'https',
    });
    expect(request.mock.calls[1][0]).toStrictEqual({
      headers,
      hostname: 'ca.wiktionary.org',
      path: '/w/rest.php/v1/page/cases/html',
      protocol: 'https',
    });
  });

  it('encodes the middle dot in the title of a page', async () => {
    serveWiktionary([], {});

    await crawl(Locale.CA_ES, 'cel·la');

    expect(getRequestedPages()).toEqual(['/w/rest.php/v1/page/cel%C2%B7la/html']);
  });

  it('reads the pages of the accented spellings of a word', async () => {
    serveWiktionary(['cafè', 'café'], { cafe: 'not found', cafè: 'cafè page', café: 'café page' });

    expect(await crawl(Locale.CA_ES, 'cafe')).toBe('not found\ncafè page\ncafé page');
  });

  it('keeps the cedilla apart from the accents', async () => {
    serveWiktionary(['cançó', 'canco', 'cançons'], {});

    await crawl(Locale.CA_ES, 'canço');

    expect(getRequestedPages()).toEqual([
      '/w/rest.php/v1/page/can%C3%A7o/html',
      '/w/rest.php/v1/page/can%C3%A7%C3%B3/html',
    ]);
  });

  it('skips titles that only start with the word, or differ in case', async () => {
    serveWiktionary(['cafeïna', 'CAFÈ', 'Cafè', 'cafè negre'], {});

    await crawl(Locale.CA_ES, 'cafe');

    expect(getRequestedPages()).toEqual(['/w/rest.php/v1/page/cafe/html']);
  });

  it('does not read the page of the word twice', async () => {
    serveWiktionary(['cases'], {});

    await crawl(Locale.CA_ES, 'cases');

    expect(getRequestedPages()).toEqual(['/w/rest.php/v1/page/cases/html']);
  });

  it('limits how many pages one word reads', async () => {
    serveWiktionary(['aé', 'aè', 'àe', 'áe', 'âe', 'äe'], {});

    await crawl(Locale.CA_ES, 'ae');

    expect(getRequestedPages()).toHaveLength(4);
  });

  it('reads only the page of the word when the search answers nonsense', async () => {
    request.mockResolvedValue('<html>Too many requests</html>');

    await crawl(Locale.CA_ES, 'cases');

    expect(getRequestedPages()).toEqual(['/w/rest.php/v1/page/cases/html']);
  });

  it('rejects when the search fails', async () => {
    request.mockRejectedValue(new Error('offline'));

    expect(await crawl(Locale.CA_ES, 'cases').catch(String)).toBe('Error: offline');
  });
});

function serveWiktionary(titles: string[], pages: Record<string, string>): void {
  request.mockImplementation((options) => {
    const { path } = options as { path: string };

    if (path.startsWith('/w/api.php')) {
      return Promise.resolve(JSON.stringify({ query: { search: titles.map((title) => ({ title })) } }));
    }

    return Promise.resolve(pages[decodeURIComponent(path.split('/').at(-2) ?? '')] ?? '');
  });
}

function getRequestedPages(): string[] {
  return request.mock.calls
    .map(([options]) => (options as { path: string }).path)
    .filter((path) => path.startsWith('/w/rest.php'));
}

function getExpectedOptions({ pathPrefix, ...options }: typeof CNRTL | typeof WIKTIONARY, encodedWord: string): object {
  return { ...options, path: `${pathPrefix}${encodedWord}`, protocol: 'https' };
}

function returnError(error: unknown): unknown {
  return error;
}
