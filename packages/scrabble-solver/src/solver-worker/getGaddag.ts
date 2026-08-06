import { Gaddag } from '@kamilmielnik/gaddag';
import { type Locale } from '@scrabble-solver/types';

import { deleteDictionary, getDictionary } from './dictionaries';

interface DeserializedDictionary {
  gaddag: Gaddag;
  version: string;
}

const deserializedDictionaries: Partial<Record<Locale, DeserializedDictionary>> = {};

/**
 * Returns undefined when there is no cached dictionary or when the cached
 * dictionary cannot be deserialized (it was downloaded by an app version with
 * an incompatible format). An undeserializable entry is deleted before
 * returning, so the revalidation the caller triggers next downloads a fresh
 * dictionary instead of getting a 304 for the broken bytes.
 */
export async function getGaddag(locale: Locale): Promise<Gaddag | undefined> {
  const response = await getDictionary(locale);

  if (typeof response === 'undefined') {
    return undefined;
  }

  const version = readVersion(response);
  const deserialized = deserializedDictionaries[locale];

  if (deserialized && deserialized.version === version) {
    return deserialized.gaddag;
  }

  try {
    const gaddag = Gaddag.deserialize(new Uint8Array(await response.arrayBuffer()));

    if (typeof version !== 'undefined') {
      deserializedDictionaries[locale] = { gaddag, version };
    }

    return gaddag;
  } catch {
    delete deserializedDictionaries[locale];
    await deleteDictionary(locale);
    return undefined;
  }
}

/**
 * Read from the cached response rather than tracked in memory, so a dictionary
 * another tab downloaded into the shared cache is picked up here too.
 */
function readVersion(response: Response): string | undefined {
  const etag = response.headers.get('etag');

  if (etag !== null) {
    return etag;
  }

  const parts = ['date', 'content-length'].map((name) => response.headers.get(name) ?? '');
  return parts.every((part) => part === '') ? undefined : parts.join('|');
}
