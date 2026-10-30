import { describe, expect, it } from 'bun:test';

import { getRejection } from '../test/getRejection';
import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as getTxtWordListModule from './getTxtWordList';

const harness = installFetcherHarness();
const { getTxtWordList }: typeof getTxtWordListModule = await import('./getTxtWordList');

const FILE_URL = 'https://words.example/list.txt';

describe('getTxtWordList', () => {
  it('downloads the url and returns its words', async () => {
    harness.serve(FILE_URL, 'AA\r\nab\n\nad\n');

    expect(await getTxtWordList(FILE_URL, 'en-US')).toEqual(['aa', 'ab', 'ad']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('reads the file as UTF-8', async () => {
    harness.serve(FILE_URL, 'aa\nżółć\n');

    expect(await getTxtWordList(FILE_URL, 'pl-PL')).toEqual(['aa', 'żółć']);
  });

  it('lower-cases the file using the given locale', async () => {
    harness.serve(FILE_URL, 'aa\n');

    await getTxtWordList(FILE_URL, 'pl-PL');

    expect(harness.getLowerCasingLocales()).toEqual(['pl-PL']);
  });

  it('removes the downloaded file', async () => {
    harness.serve(FILE_URL, 'aa\n');

    await getTxtWordList(FILE_URL, 'en-US');

    expect(harness.listTempFiles()).toEqual([]);
  });

  it('rejects when the download fails', async () => {
    harness.serve(FILE_URL, 'gone', 404);

    expect((await getRejection(getTxtWordList(FILE_URL, 'en-US'))).message).toContain(
      `Cannot download file: ${FILE_URL}`,
    );
  });

  it('removes the downloaded file when it holds no words', async () => {
    harness.serve(FILE_URL, '');

    await getTxtWordList(FILE_URL, 'en-US').catch(() => undefined);

    expect(harness.listTempFiles()).toEqual([]);
  });
});
