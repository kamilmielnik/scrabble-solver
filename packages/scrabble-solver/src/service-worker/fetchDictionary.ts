import { Locale } from '@scrabble-solver/types';
import { CacheExpiration } from 'workbox-expiration';

const DICTIONARY_CACHE = 'dictionary-api-cache';

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const expirationManager = new CacheExpiration(DICTIONARY_CACHE, {
  maxAgeSeconds: MAX_AGE / 1000,
});

const fetchDictionary = async (locale: Locale): Promise<string> => {
  const url = `/api/dictionary/${locale}`;
  const response = await readOrFetchDictionary(url);
  const serialized = await response.clone().text();
  return serialized;
};

const readOrFetchDictionary = async (url: string): Promise<Response> => {
  await expirationManager.expireEntries();

  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);

  if (typeof cached !== 'undefined') {
    return cached;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  await cache.put(url, response);
  await expirationManager.updateTimestamp(url);

  return response;
};

export default fetchDictionary;
