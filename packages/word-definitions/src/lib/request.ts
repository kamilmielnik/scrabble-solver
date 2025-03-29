import { isError } from '@scrabble-solver/types';
import { http, https } from 'follow-redirects';
import { type RequestOptions } from 'http';

interface Options extends RequestOptions {
  protocol?: 'http' | 'https';
}

export const request = ({ protocol, ...options }: Options): Promise<string> => {
  const agent = protocol === 'https' ? https : http;

  return new Promise((resolve, reject) => {
    return agent
      .get(options, (response) => {
        let data = '';
        response.setEncoding('utf8');
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
