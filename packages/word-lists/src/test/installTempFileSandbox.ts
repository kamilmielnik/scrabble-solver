import { afterAll, afterEach, beforeEach, spyOn } from 'bun:test';
import fs from 'fs';
import os from 'os';
import { join } from 'path';
import { finished } from 'stream/promises';

export interface TempFileSandbox {
  directory: string;
  listFiles: () => string[];
  waitForWriteStreams: () => Promise<void>;
}

const SANDBOX_HOME = join(os.tmpdir(), `word-lists-test-${process.pid}`);

/**
 * `getTempFilepath` freezes `$HOME/.scrabble-solver`, home of the developer's dictionary cache, when it is first
 * evaluated. Call this before importing the code under test, so that every temp file lands in a throwaway directory.
 * The home is fixed per process, because the first test file to load that module decides for all the others.
 */
export function installTempFileSandbox(): TempFileSandbox {
  const directory = join(SANDBOX_HOME, '.scrabble-solver');
  const homedirSpy = spyOn(os, 'homedir').mockReturnValue(SANDBOX_HOME);
  const writeStreams: fs.WriteStream[] = [];
  let restoreCreateWriteStream: (() => void) | undefined;

  fs.mkdirSync(directory, { recursive: true });
  beforeEach(trackWriteStreams);
  afterEach(settleWriteStreams);
  afterEach(removeFiles);
  afterAll(removeSandbox);

  return { directory, listFiles, waitForWriteStreams };

  function listFiles(): string[] {
    return fs.readdirSync(directory);
  }

  /** `unzip` can resolve before its output reaches the disk, so tests of what it wrote wait for this too. */
  async function waitForWriteStreams(): Promise<void> {
    await Promise.all(writeStreams.map((stream) => finished(stream)));
  }

  function trackWriteStreams(): void {
    const { createWriteStream } = fs;
    const createWriteStreamSpy = spyOn(fs, 'createWriteStream').mockImplementation(createTrackedWriteStream);

    fs.mkdirSync(directory, { recursive: true });
    restoreCreateWriteStream = () => {
      createWriteStreamSpy.mockRestore();
    };

    function createTrackedWriteStream(...args: Parameters<typeof createWriteStream>): fs.WriteStream {
      const stream = createWriteStream(...args);
      writeStreams.push(stream);
      return stream;
    }
  }

  /** A stream the code under test abandoned opens its file late and would otherwise surface in the next test. */
  async function settleWriteStreams(): Promise<void> {
    restoreCreateWriteStream?.();
    await Promise.all(writeStreams.map(waitUntilOpened));
    writeStreams.length = 0;
  }

  function removeFiles(): void {
    fs.rmSync(directory, { force: true, recursive: true });
  }

  function removeSandbox(): void {
    homedirSpy.mockRestore();
    fs.rmSync(SANDBOX_HOME, { force: true, recursive: true });
  }
}

function waitUntilOpened(stream: fs.WriteStream): Promise<void> {
  return new Promise((resolve) => {
    if (stream.closed || !stream.pending) {
      resolve();
      return;
    }

    stream.once('open', resolve);
    stream.once('close', resolve);
    stream.once('error', resolve);
  });
}
