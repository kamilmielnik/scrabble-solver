import { request } from '../lib';

const crawlRomanian = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'dexonline.ro',
    path: `/definitie/${encodeURIComponent(word)}`,
  });
};

export default crawlRomanian;
