import { request } from '../lib';

const crawlEnglish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.merriam-webster.com',
    path: `/dictionary/${encodeURIComponent(word)}`,
  });
};

export default crawlEnglish;
