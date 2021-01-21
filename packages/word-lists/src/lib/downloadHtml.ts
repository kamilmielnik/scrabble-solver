import http from 'http';
import https from 'https';

const downloadHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
      response.on('error', reject);
    });
  });
};

export default downloadHtml;
