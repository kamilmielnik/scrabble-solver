import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { getDictionaryUrl } from './getDictionaryUrl';
import { resetRevalidationThrottle } from './revalidateDictionary';

export async function getDictionary(locale: Locale): Promise<Response | undefined> {
  const cache = await caches.open(DICTIONARY_CACHE);
  return cache.match(getDictionaryUrl(locale));
}

export async function deleteDictionary(locale: Locale): Promise<void> {
  const cache = await caches.open(DICTIONARY_CACHE);
  await cache.delete(getDictionaryUrl(locale));
  /**
   * Reset last: resetting first leaves a window in which a revalidation starts,
   * reads the doomed entry's ETag, takes the 304 it answers with, and arms the
   * throttle against a dictionary this call is about to delete.
   */
  await resetRevalidationThrottle(locale);
}
