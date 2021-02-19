import { request } from '../lib';

const crawlPolish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'sjp.pl',
    path: `/${encodeURIComponent(word)}`,
  });
};

export default crawlPolish;
