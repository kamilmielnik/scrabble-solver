import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

const DICTIONARY_CACHE = 'dictionary-cache';

const fetchDictionary = async (locale: Locale): Promise<Trie> => {
  const response = await readOrFetchDictionary(`/api/dictionary/${locale}`);
  const serialized = await response.clone().text();
  const trie = Trie.deserialize(serialized);

  return trie;
};

const readOrFetchDictionary = async (url: string): Promise<Response> => {
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);

  if (typeof cached !== 'undefined') {
    return cached;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  cache.put(url, response);

  return response;
};

export default fetchDictionary;
