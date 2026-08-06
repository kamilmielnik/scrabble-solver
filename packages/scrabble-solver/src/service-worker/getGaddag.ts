import { Gaddag } from '@kamilmielnik/gaddag';
import { type Locale } from '@scrabble-solver/types';

import { deleteDictionary, getDictionary, getDictionaryGeneration } from './dictionaries';

interface DeserializedDictionary {
  gaddag: Gaddag;
  generation: number;
}

// Reused between requests until revalidateDictionary stores a new response
// and bumps the locale's generation. The memoized path touches neither the
// Cache API nor IndexedDB, keeping repeated solves free of storage I/O.
const deserializedDictionaries: Partial<Record<Locale, DeserializedDictionary>> = {};

/**
 * Returns undefined when there is no cached dictionary or when the cached
 * dictionary cannot be deserialized (it was downloaded by an app version with
 * an incompatible format). An undeserializable entry is deleted so the next
 * revalidation downloads a fresh dictionary instead of getting a 304 for the
 * broken bytes; callers fall back to the server in the meantime.
 */
export const getGaddag = async (locale: Locale): Promise<Gaddag | undefined> => {
  const generation = getDictionaryGeneration(locale);
  const deserialized = deserializedDictionaries[locale];

  if (deserialized && deserialized.generation === generation) {
    return deserialized.gaddag;
  }

  const response = await getDictionary(locale);

  if (typeof response === 'undefined') {
    return undefined;
  }

  try {
    const gaddag = Gaddag.deserialize(new Uint8Array(await response.arrayBuffer()));
    deserializedDictionaries[locale] = { gaddag, generation };
    return gaddag;
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deleteDictionary(locale);
    return undefined;
  }
};
