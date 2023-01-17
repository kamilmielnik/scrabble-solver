import { request } from '../lib';

const crawlFarsi = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.vajehyab.com',
    path: `/moein/${encodeURIComponent(word)}`,
  });
};

export default crawlFarsi;
