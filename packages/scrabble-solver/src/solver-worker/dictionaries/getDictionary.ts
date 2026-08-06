import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { getDictionaryUrl } from './getDictionaryUrl';
import { resetRevalidationThrottle } from './revalidateDictionary';

export async function getDictionary(locale: Locale): Promise<Response | undefined> {
  const cache = await caches.open(DICTIONARY_CACHE);
  return cache.match(getDictionaryUrl(locale));
}

export async function deleteDictionary(locale: Locale): Promise<void> {
  // Reset first, so a revalidation racing this delete cannot arm the throttle.
  await resetRevalidationThrottle(locale);
  const cache = await caches.open(DICTIONARY_CACHE);
  await cache.delete(getDictionaryUrl(locale));
}
