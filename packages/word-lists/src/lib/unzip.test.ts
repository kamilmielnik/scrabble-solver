import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { createZip } from '../test/createZip';
import { getRejection } from '../test/getRejection';
import { installTempFileSandbox } from '../test/installTempFileSandbox';

import { unzip } from './unzip';

installTempFileSandbox();

const REQUESTED_ENTRY = 'slowa.txt';
const WORDS = 'aa\nżółć\n';
const LARGE_ENTRY = Buffer.alloc(1024 * 1024, 'word\n');
const HANG_GUARD_MS = 5000;

let directory: string;
let outputFilename: string;
let zipFilename: string;

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'word-lists-test-'));
  outputFilename = join(directory, 'output.txt');
  zipFilename = join(directory, 'archive.zip');
});

afterEach(() => {
  rmSync(directory, { force: true, recursive: true });
});

describe.each(['store', 'deflate'] as const)('unzip of a zip using %s', (compression) => {
  it('extracts the only entry', async () => {
    writeZip([{ content: WORDS, name: REQUESTED_ENTRY }]);

    await unzipRequestedEntry();

    expect(readFileSync(outputFilename, 'utf-8')).toBe(WORDS);
  });

  it('extracts an entry placed after other entries', async () => {
    writeZip([
      { content: 'first', name: 'README' },
      { content: 'second', name: 'COPYING' },
      { content: WORDS, name: REQUESTED_ENTRY },
    ]);

    await unzipRequestedEntry();

    expect(readFileSync(outputFilename, 'utf-8')).toBe(WORDS);
  });

  it('extracts an entry placed before other entries', async () => {
    writeZip([
      { content: WORDS, name: REQUESTED_ENTRY },
      { content: 'last', name: 'README' },
    ]);

    await unzipRequestedEntry();

    expect(readFileSync(outputFilename, 'utf-8')).toBe(WORDS);
  });

  it(
    'drains a large entry that was not requested to reach the requested one',
    async () => {
      writeZip([
        { content: LARGE_ENTRY, name: 'README' },
        { content: WORDS, name: REQUESTED_ENTRY },
      ]);

      await unzipRequestedEntry();

      expect(readFileSync(outputFilename, 'utf-8')).toBe(WORDS);
    },
    HANG_GUARD_MS,
  );

  it('extracts a large entry byte for byte', async () => {
    writeZip([{ content: LARGE_ENTRY, name: REQUESTED_ENTRY }]);

    await unzipRequestedEntry();

    expect(readFileSync(outputFilename).equals(LARGE_ENTRY)).toBe(true);
  });

  it('writes nothing but the requested entry', async () => {
    writeZip([
      { content: 'first', name: 'README' },
      { content: WORDS, name: REQUESTED_ENTRY },
      { content: 'last', name: 'COPYING' },
    ]);

    await unzipRequestedEntry();

    expect(readdirSync(directory).sort()).toEqual(['archive.zip', 'output.txt']);
  });

  it('resolves without an output file when the requested entry is missing', async () => {
    writeZip([{ content: 'first', name: 'README' }]);

    await unzip(zipFilename, REQUESTED_ENTRY, outputFilename);

    expect(readdirSync(directory)).toEqual(['archive.zip']);
  });

  it('does not mistake an entry from a subdirectory for the requested one', async () => {
    writeZip([{ content: WORDS, name: `nested/${REQUESTED_ENTRY}` }]);

    await unzip(zipFilename, REQUESTED_ENTRY, outputFilename);

    expect(readdirSync(directory)).toEqual(['archive.zip']);
  });

  it('rejects when the zip ends in the middle of the requested entry', async () => {
    const zip = createZip([{ content: LARGE_ENTRY, name: REQUESTED_ENTRY }], compression);
    writeFileSync(zipFilename, zip.subarray(0, zip.length / 2));

    expect((await getRejection(unzip(zipFilename, REQUESTED_ENTRY, outputFilename))).message).toContain('FILE_ENDED');
  });

  function writeZip(entries: Parameters<typeof createZip>[0]): void {
    writeFileSync(zipFilename, createZip(entries, compression));
  }
});

describe('unzip of a file that is not a zip', () => {
  it('rejects for an HTML page saved as a zip', async () => {
    writeFileSync(zipFilename, '<html>Service unavailable</html>');

    expect((await getRejection(unzip(zipFilename, REQUESTED_ENTRY, outputFilename))).message).toContain(
      'invalid signature',
    );
  });

  it('rejects for an empty file', async () => {
    writeFileSync(zipFilename, '');

    expect((await getRejection(unzip(zipFilename, REQUESTED_ENTRY, outputFilename))).message).toContain('FILE_ENDED');
  });

  it('rejects for a file cut off inside the first header', async () => {
    writeFileSync(zipFilename, createZip([{ content: WORDS, name: REQUESTED_ENTRY }]).subarray(0, 10));

    expect((await getRejection(unzip(zipFilename, REQUESTED_ENTRY, outputFilename))).message).toContain('FILE_ENDED');
  });

  it('rejects when the zip file does not exist', async () => {
    expect((await getRejection(unzip(zipFilename, REQUESTED_ENTRY, outputFilename))).message).toContain('ENOENT');
  });
});

describe('unzip of a stored entry', () => {
  it('resolves only after the requested entry is fully written', async () => {
    writeFileSync(zipFilename, createZip([{ content: WORDS, name: REQUESTED_ENTRY }]));

    await unzip(zipFilename, REQUESTED_ENTRY, outputFilename);

    expect(readFileSync(outputFilename, 'utf-8')).toBe(WORDS);
  });
});

function unzipRequestedEntry(): Promise<void> {
  return unzip(zipFilename, REQUESTED_ENTRY, outputFilename);
}
