import fs from 'fs';
import unzipper from 'unzipper';

export const unzip = (zipFilename: string, extractFilename: string, outputFilename: string): Promise<void> => {
  return fs
    .createReadStream(zipFilename)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const fileName = entry.path;

      if (fileName === extractFilename) {
        entry.pipe(fs.createWriteStream(outputFilename));
      } else {
        entry.autodrain();
      }
    })
    .promise();
};
