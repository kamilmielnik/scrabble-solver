import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

interface ResponsePayload {
  en?: Usage[];
}

interface Usage {
  definitions?: Definition[];
}

interface Definition {
  definition: string;
}

export const crawl = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'en.wiktionary.org',
    path: `/api/rest_v1/page/definition/${encodeURIComponent(word)}`,
    headers: {
      'User-Agent': 'scrabble-solver (https://github.com/kamilmielnik/scrabble-solver)',
    },
  });
};

export const parse = (json: string): ParsingResult => {
  let data: ResponsePayload;

  try {
    data = JSON.parse(json);
  } catch {
    return { definitions: [], exists: false };
  }

  const usages: Usage[] = data?.en ?? [];

  if (!Array.isArray(usages)) {
    return { definitions: [], exists: false };
  }

  const definitions = usages
    .flatMap((usage) => (usage.definitions ?? []).map(({ definition }) => definition))
    .map((definition) => load(definition).text().trim())
    .filter(Boolean);

  return {
    definitions,
    exists: definitions.length > 0,
  };
};
