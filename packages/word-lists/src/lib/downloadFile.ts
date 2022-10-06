import { http, https } from 'follow-redirects';
import { fs } from 'memfs';

import getTempFilename from './getTempFilename';

const downloadFile = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempFilename = getTempFilename();
    const writeStream = fs.createWriteStream(tempFilename);
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        writeStream.on('finish', () => writeStream.close());
        reject(new Error(`Cannot download file: ${url}`));
        return;
      }

      response.on('error', (error) => {
        writeStream.on('finish', () => writeStream.close());
        reject(error);
      });

      response.on('end', () => {
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(tempFilename);
        });
      });

      response.pipe(writeStream);
    });

    request.on('error', (error) => {
      writeStream.on('finish', () => writeStream.close());
      reject(error);
    });
  });
};

export default downloadFile;
