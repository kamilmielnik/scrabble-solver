import { Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import expirationManager from './expirationManager';
import getDictionaryUrl from './getDictionaryUrl';

const requests: Partial<Record<string, Promise<Response> | undefined>> = {};

const revalidateDictionary = async (locale: Locale): Promise<void> => {
  const url = getDictionaryUrl(locale);

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
};

export default revalidateDictionary;
