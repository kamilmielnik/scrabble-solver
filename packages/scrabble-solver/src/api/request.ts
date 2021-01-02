import http, { RequestOptions } from 'http';
import https from 'https';

interface Options extends RequestOptions {
  protocol?: 'http' | 'https';
}

const request = ({ protocol, ...options }: Options): Promise<string> => {
  const agent = protocol === 'https' ? https : http;

  return new Promise((resolve, reject) =>
    agent
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
            reject(error);
          }
        });
      })
      .on('error', reject),
  );
};

export default request;
