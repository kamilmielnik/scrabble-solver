import { request } from '../lib';

const crawlSpanish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'dle.rae.es',
    path: `/?w=${encodeURIComponent(word)}`,
  });
};

export default crawlSpanish;
