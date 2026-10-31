import { isError } from '@scrabble-solver/types';
import { http, https } from 'follow-redirects';
import { type RequestOptions } from 'http';

interface Options extends RequestOptions {
  protocol?: 'http' | 'https';
}

const DEFAULT_TIMEOUT_MS = 10_000;

export const request = ({ protocol, timeout = DEFAULT_TIMEOUT_MS, ...options }: Options): Promise<string> => {
  const agent = protocol === 'https' ? https : http;

  return new Promise((resolve, reject) => {
    return agent
      .get({ ...options, signal: AbortSignal.timeout(timeout) }, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('error', reject);
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            resolve(data);
          } catch (error) {
            reject(isError(error) ? error : new Error(String(error)));
          }
        });
      })
      .on('error', reject);
  });
};
