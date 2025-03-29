import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { expirationManager } from './expirationManager';
import { getDictionaryUrl } from './getDictionaryUrl';

const requests: Partial<Record<Locale, Promise<Response> | undefined>> = {};

export const revalidateDictionary = async (locale: Locale): Promise<void> => {
  if (requests[locale] instanceof Promise) {
    return;
  }

  let response: Response | undefined;
  const url = getDictionaryUrl(locale);
  const request = fetch(url);
  requests[locale] = request;

  try {
    response = await request;

    if (!response.ok) {
      requests[locale] = undefined;
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const cache = await caches.open(DICTIONARY_CACHE);
    await cache.put(url, response.clone());
    await expirationManager.updateTimestamp(url);
  } finally {
    requests[locale] = undefined;
  }
};
