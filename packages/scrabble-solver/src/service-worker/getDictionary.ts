import { Locale } from '@scrabble-solver/types';
import { CacheExpiration } from 'workbox-expiration';

const DICTIONARY_CACHE = 'dictionary-api-cache';

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const expirationManager = new CacheExpiration(DICTIONARY_CACHE, {
  maxAgeSeconds: MAX_AGE / 1000,
});

const requests: Partial<Record<string, Promise<Response> | undefined>> = {};

const getDictionary = async (locale: Locale): Promise<string | undefined> => {
  await expirationManager.expireEntries();

  const url = `/api/dictionary/${locale}`;
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);

  if (typeof cached === 'undefined') {
    revalidateDictionary(url);
    return undefined;
  }

  const serialized = await cached.clone().text();
  return serialized;
};

const revalidateDictionary = async (url: string): Promise<void> => {
  if (requests[url] instanceof Promise) {
    return;
  }

  const request = fetch(url);
  requests[url] = request;
  let response: Response | undefined;

  try {
    response = await request;
  } finally {
    requests[url] = undefined;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const cache = await caches.open(DICTIONARY_CACHE);
  await cache.put(url, response.clone());
  await expirationManager.updateTimestamp(url);

  return;
};

export default getDictionary;
