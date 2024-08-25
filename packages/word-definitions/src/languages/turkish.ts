import { request } from '../lib';
import { ParsingResult } from '../types';

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'sozluk.gov.tr',
    path: `/gts?ara=${encodeURIComponent(word)}`,
    headers: {
      'content-type': 'text/json',
    },
  });
};

export const parse = (json: string): ParsingResult => {
  const response = JSON.parse(json);

  if (response.error) {
    return {
      definitions: [],
      exists: false,
    };
  }

  const [wordInfo] = response;
  const definitions = wordInfo.anlamlarListe.map((entry: { anlam: string }) => entry.anlam.replace('►', '').trim());

  return {
    definitions,
    exists: definitions.length > 0,
  };
};
