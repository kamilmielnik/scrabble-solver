import fs from 'fs';
import { pipeline } from 'stream/promises';
import unzipper, { type Entry } from 'unzipper';

export async function unzip(zipFilename: string, extractFilename: string, outputFilename: string): Promise<void> {
  const writes: Promise<void>[] = [];
  const parser = unzipper.Parse();

  parser.on('entry', (entry: Entry) => {
    if (entry.path === extractFilename) {
      writes.push(pipeline(entry, fs.createWriteStream(outputFilename)));
    } else {
      entry.autodrain();
    }
  });

  const read = fs.createReadStream(zipFilename);
  read.on('error', (error) => parser.emit('error', error));
  await read.pipe(parser).promise();
  await Promise.all(writes);
}
