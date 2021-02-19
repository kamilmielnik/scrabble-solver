import { request } from '../lib';

const crawlFrench = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.cnrtl.fr',
    path: `/definition/${encodeURIComponent(word)}`,
  });
};

export default crawlFrench;
