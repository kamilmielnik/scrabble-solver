import { request } from '../lib';

const crawlGerman = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.dwds.de',
    path: `/wb/${encodeURIComponent(word)}`,
  });
};

export default crawlGerman;
