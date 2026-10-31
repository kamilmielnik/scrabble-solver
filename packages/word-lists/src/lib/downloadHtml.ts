import { http, https } from 'follow-redirects';

import { DOWNLOAD_TIMEOUT_MS } from '../constants';

export const downloadHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol
      .get(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) }, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve(data);
        });
        response.on('error', reject);
      })
      .on('error', reject);
  });
};
