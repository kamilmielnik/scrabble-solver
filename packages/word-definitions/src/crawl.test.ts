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

function getExpectedOptions({ pathPrefix, ...options }: typeof CNRTL | typeof WIKTIONARY, encodedWord: string): object {
  return { ...options, path: `${pathPrefix}${encodedWord}`, protocol: 'https' };
}

function returnError(error: unknown): unknown {
  return error;
}
