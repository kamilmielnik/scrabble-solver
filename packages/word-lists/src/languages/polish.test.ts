/* eslint-disable max-lines */
import { Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import unzipper from 'unzipper';

import { createZip } from '../test/createZip';
import { getRejection } from '../test/getRejection';
import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as polishModule from './polish';

const harness = installFetcherHarness();
const { getWordList }: typeof polishModule = await import('./polish');

interface ParseConstructor {
  prototype: { promise: () => Promise<void> };
}

const PAGE_URL = 'https://sjp.pl/sl/growy/';
const ZIP_URL = `${PAGE_URL}sjp-20261031.zip`;
const BACKUP_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/polish/sjp.txt';
const WORD_LIST_ENTRY = 'slowa.txt';
const MINIMUM_TRUSTED_WORD_COUNT = 2_000_000;
const PAGE = '<html><body><a href="sjp-20261031.zip">Pobierz</a></body></html>';
const BACKUP_FILE = 'aa\nbackup\n';
const BACKUP_WORDS = ['aa', 'backup'];
const TRUSTED_ZIP = createZip([{ content: createWordListFile(MINIMUM_TRUSTED_WORD_COUNT), name: WORD_LIST_ENTRY }]);
const TOO_SMALL_ZIP = createZip([
  { content: createWordListFile(MINIMUM_TRUSTED_WORD_COUNT - 1), name: WORD_LIST_ENTRY },
]);

beforeEach(() => {
  const { prototype } = unzipper.Parse as unknown as ParseConstructor;
  const { promise } = prototype;

  spyOn(prototype, 'promise').mockImplementation(async function waitForOutput(this: unknown) {
    await promise.call(this);
    await harness.waitForWriteStreams();
  });
});

describe('polish getWordList', () => {
  describe('when sjp.pl offers a complete word list', () => {
    it('reads the page, downloads the zip and skips the backup', async () => {
      serveWorkingSources();

      await getWordList();

      expect(harness.requestedUrls).toEqual([PAGE_URL, ZIP_URL]);
    });

    it('returns the words of the zip', async () => {
      serveWorkingSources();

      const words = await getWordList();

      expect(words).toHaveLength(MINIMUM_TRUSTED_WORD_COUNT);
      expect(words[0]).toBe('aa');
    });

    it('cleans up the words the same way as any other list', async () => {
      const file = `aa\r\n  ŻÓŁĆ  \r\n\r\n${createWordListFile(MINIMUM_TRUSTED_WORD_COUNT)}`;
      serveWorkingSources(createZip([{ content: file, name: WORD_LIST_ENTRY }]));

      const words = await getWordList();

      expect(words.slice(0, 3)).toEqual(['aa', 'żółć', 'aa']);
      expect(words).toHaveLength(MINIMUM_TRUSTED_WORD_COUNT + 2);
    });

    it('collates the file using the Polish locale', async () => {
      serveWorkingSources();

      await getWordList();

      expect(harness.getCollationLocales()).toEqual([Locale.PL_PL]);
    });

    it('picks the word list among the other entries of the zip', async () => {
      const zip = createZip([
        { content: 'readme', name: 'README' },
        { content: createWordListFile(MINIMUM_TRUSTED_WORD_COUNT), name: WORD_LIST_ENTRY },
        { content: 'license', name: 'COPYING' },
      ]);
      serveWorkingSources(zip);

      expect(await getWordList()).toHaveLength(MINIMUM_TRUSTED_WORD_COUNT);
    });

    it('reads a deflated zip', async () => {
      const content = createWordListFile(MINIMUM_TRUSTED_WORD_COUNT);
      serveWorkingSources(createZip([{ content, name: WORD_LIST_ENTRY }], 'deflate'));

      expect(await getWordList()).toHaveLength(MINIMUM_TRUSTED_WORD_COUNT);
    });

    it('leaves no temp files behind', async () => {
      serveWorkingSources();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });
  });

  describe('resolving the zip link', () => {
    it.each([
      ['a file next to the page', 'sjp.zip', 'https://sjp.pl/sl/growy/sjp.zip'],
      ['a root-relative path', '/pliki/sjp.zip', 'https://sjp.pl/pliki/sjp.zip'],
      ['a parent directory', '../sjp.zip', 'https://sjp.pl/sl/sjp.zip'],
      ['an absolute url', 'https://mirror.example/sjp.zip', 'https://mirror.example/sjp.zip'],
    ])('resolves a link to %s', async (_description, href, expectedUrl) => {
      harness.serve(PAGE_URL, `<a href="${href}">Pobierz</a>`);
      harness.serve(expectedUrl, TRUSTED_ZIP);

      expect(await getWordList()).toHaveLength(MINIMUM_TRUSTED_WORD_COUNT);
      expect(harness.requestedUrls).toEqual([PAGE_URL, expectedUrl]);
    });

    it('ignores anchors without an href and links to other files', async () => {
      harness.serve(PAGE_URL, '<a name="top">top</a><a href="sjp.tar.gz">tar</a><a href="sjp.zip">zip</a>');
      harness.serve(`${PAGE_URL}sjp.zip`, TRUSTED_ZIP);

      await getWordList();

      expect(harness.requestedUrls).toEqual([PAGE_URL, `${PAGE_URL}sjp.zip`]);
    });

    it('uses the first zip link of the page', async () => {
      harness.serve(PAGE_URL, '<a href="first.zip">new</a><a href="second.zip">old</a>');
      harness.serve(`${PAGE_URL}first.zip`, TRUSTED_ZIP);

      await getWordList();

      expect(harness.requestedUrls).toEqual([PAGE_URL, `${PAGE_URL}first.zip`]);
    });
  });

  describe('falling back to the backup list', () => {
    it.each([
      ['the page has no zip link', servePageWithoutZipLink],
      ['the page answers with an error', servePageError],
      ['the zip link is dead', serveDeadZipLink],
      ['the zip connection is refused', refuseZipConnection],
      ['the zip is corrupt', serveCorruptZip],
      ['the zip is cut off', serveTruncatedZip],
      ['the zip has no word list', serveZipWithoutWordList],
      ['the word list is empty', serveEmptyWordList],
      ['the word list is too small to trust', serveTooSmallWordList],
    ])('returns the backup list when %s', async (_description, breakPrimarySource) => {
      serveWorkingSources();
      breakPrimarySource();

      expect(await getWordList()).toEqual(BACKUP_WORDS);
      expect(harness.requestedUrls.at(-1)).toBe(BACKUP_URL);
      expect(harness.getCollationLocales().at(-1)).toBe(Locale.PL_PL);
    });

    it('rejects when the backup list fails too', async () => {
      servePageWithoutZipLink();
      harness.serve(BACKUP_URL, 'gone', 404);

      expect((await getRejection(getWordList())).message).toContain(`Cannot download file: ${BACKUP_URL}`);
    });

    it.each([
      ['the page has no zip link', servePageWithoutZipLink],
      ['the zip has no word list', serveZipWithoutWordList],
      ['the word list is empty', serveEmptyWordList],
      ['the word list is too small to trust', serveTooSmallWordList],
    ])('leaves no temp files behind when %s', async (_description, breakPrimarySource) => {
      serveWorkingSources();
      breakPrimarySource();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });

    it.todo('returns the backup list when the page connection is refused', async () => {
      serveWorkingSources();
      harness.refuseConnections(PAGE_URL);

      expect(await getWordList()).toEqual(BACKUP_WORDS);
    });

    it.todo('leaves no temp files behind when the zip link is dead', async () => {
      serveWorkingSources();
      serveDeadZipLink();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });

    it.todo('leaves no temp files behind when the zip connection is refused', async () => {
      serveWorkingSources();
      refuseZipConnection();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });

    it.todo('leaves no temp files behind when the zip is corrupt', async () => {
      serveWorkingSources();
      serveCorruptZip();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });

    it.todo('leaves no temp files behind when the zip is cut off', async () => {
      serveWorkingSources();
      serveTruncatedZip();

      await getWordList();

      expect(harness.listTempFiles()).toEqual([]);
    });
  });
});

function createWordListFile(wordCount: number): string {
  return 'aa\n'.repeat(wordCount);
}

function serveWorkingSources(zip: Buffer = TRUSTED_ZIP): void {
  harness.serve(PAGE_URL, PAGE);
  harness.serve(ZIP_URL, zip);
  harness.serve(BACKUP_URL, BACKUP_FILE);
}

function servePageWithoutZipLink(): void {
  harness.serve(PAGE_URL, '<html><body><a href="about.html">O nas</a></body></html>');
}

function servePageError(): void {
  harness.serve(PAGE_URL, '<html>Service unavailable</html>', 503);
}

function serveDeadZipLink(): void {
  harness.serve(ZIP_URL, 'gone', 404);
}

function refuseZipConnection(): void {
  harness.refuseConnections(ZIP_URL);
}

function serveCorruptZip(): void {
  harness.serve(ZIP_URL, '<html>this is not a zip</html>');
}

function serveTruncatedZip(): void {
  harness.serve(ZIP_URL, TRUSTED_ZIP.subarray(0, TRUSTED_ZIP.length / 2));
}

function serveZipWithoutWordList(): void {
  harness.serve(ZIP_URL, createZip([{ content: 'readme', name: 'README' }]));
}

function serveEmptyWordList(): void {
  harness.serve(ZIP_URL, createZip([{ content: '', name: WORD_LIST_ENTRY }]));
}

function serveTooSmallWordList(): void {
  harness.serve(ZIP_URL, TOO_SMALL_ZIP);
}
