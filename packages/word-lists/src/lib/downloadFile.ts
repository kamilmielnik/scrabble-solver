import http from 'http';
import https from 'https';
import { Writable } from 'stream';

const downloadFile = (url: string, outputStream: Writable): Promise<void> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
        reject();
        return;
      }

      response.pipe(outputStream);
      response.on('error', reject);
      response.on('end', resolve);
    });
    request.on('error', reject);
  });
};

export default downloadFile;
