import { request } from '../lib';

const crawlSpanish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.diccionarios.com',
    path: `/diccionario/espanol/${encodeURIComponent(word)}`,
  });
};

export default crawlSpanish;
