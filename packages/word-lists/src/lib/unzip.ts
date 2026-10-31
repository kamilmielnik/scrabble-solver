import fs from 'fs';
import { pipeline } from 'stream/promises';
import unzipper, { type Entry } from 'unzipper';

export async function unzip(zipFilename: string, extractFilename: string, outputFilename: string): Promise<void> {
  const writes: Promise<void>[] = [];
  const parser = unzipper.Parse();

  parser.on('entry', (entry: Entry) => {
    if (entry.path === extractFilename) {
      const write = pipeline(entry, fs.createWriteStream(outputFilename));
      write.catch(failParser);
      writes.push(write);
    } else {
      entry.autodrain();
    }
  });

  const read = fs.createReadStream(zipFilename);
  read.on('error', failParser);

  try {
    await read.pipe(parser).promise();
    await Promise.all(writes);
  } finally {
    read.destroy();
  }

  function failParser(error: Error): void {
    parser.emit('error', error);
  }
}
