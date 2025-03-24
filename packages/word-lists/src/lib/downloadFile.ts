import { http, https } from 'follow-redirects';
import fs from 'fs';

import { getTempFilepath } from './getTempFilepath';

export const downloadFile = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempFilepath = getTempFilepath();
    const protocol = url.startsWith('https') ? https : http;
    const writeStream = fs.createWriteStream(tempFilepath);
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        reject(new Error(`Cannot download file: ${url}`));
        return;
      }

      response.on('error', (error) => {
        writeStream.close();
        reject(error);
      });

      response.on('end', () => {
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(tempFilepath);
        });
      });

      response.pipe(writeStream);
    });

    request.on('error', (error) => {
      writeStream.close();
      reject(error);
    });
  });
};
