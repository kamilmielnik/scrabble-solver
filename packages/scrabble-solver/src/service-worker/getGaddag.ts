import { Gaddag } from '@kamilmielnik/gaddag';
import { type Locale } from '@scrabble-solver/types';

import { getDictionary } from './dictionaries';

interface DeserializedDictionary {
  gaddag: Gaddag | undefined;
  version: string;
}

// Reused between requests until revalidateDictionary replaces the cached
// response - the validator headers change with it.
const deserializedDictionaries: Partial<Record<Locale, DeserializedDictionary>> = {};

/**
 * Returns undefined when there is no cached dictionary or when the cached
 * dictionary cannot be deserialized (it was downloaded by an app version with
 * an incompatible format). Callers fall back to the server and revalidate,
 * which replaces the incompatible cache entry.
 */
export const getGaddag = async (locale: Locale): Promise<Gaddag | undefined> => {
  const response = await getDictionary(locale);

  if (typeof response === 'undefined') {
    return undefined;
  }

  const version = getVersion(response);

  if (typeof version === 'undefined') {
    return deserialize(response);
  }

  const deserialized = deserializedDictionaries[locale];

  if (deserialized && deserialized.version === version) {
    return deserialized.gaddag;
  }

  const gaddag = await deserialize(response);
  deserializedDictionaries[locale] = { gaddag, version };
  return gaddag;
};

/**
 * The ETag alone identifies the payload, surviving revalidations that only
 * refresh the Date header. The other validator headers are a fallback for
 * responses without one.
 */
const getVersion = (response: Response): string | undefined => {
  const etag = response.headers.get('etag');

  if (etag !== null) {
    return etag;
  }

  const parts = ['date', 'content-length'].map((name) => response.headers.get(name) ?? '');
  return parts.every((part) => part === '') ? undefined : parts.join('|');
};

const deserialize = async (response: Response): Promise<Gaddag | undefined> => {
  try {
    return Gaddag.deserialize(new Uint8Array(await response.arrayBuffer()));
  } catch {
    return undefined;
  }
};
