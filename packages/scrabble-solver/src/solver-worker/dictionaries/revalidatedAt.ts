import { type Locale } from '@scrabble-solver/types';

import { REVALIDATED_AT_CACHE } from './constants';
import { getDictionaryUrl } from './getDictionaryUrl';

const timestamps: Partial<Record<Locale, number>> = {};

/**
 * A dedicated worker is created per page, so a timestamp kept only in memory
 * would let every navigation revalidate again. The Cache API is the only
 * storage a worker shares with other tabs, so the throttle lives there and is
 * read at most once per locale per worker.
 */
export async function readRevalidatedAt(locale: Locale): Promise<number> {
  const known = timestamps[locale];

  if (typeof known !== 'undefined') {
    return known;
  }

  const persisted = await readPersistedRevalidatedAt(locale);
  // A reset that landed while reading wins over the value it invalidated.
  return (timestamps[locale] ??= persisted);
}

export async function writeRevalidatedAt(locale: Locale, timestamp: number): Promise<void> {
  timestamps[locale] = timestamp;
  const cache = await caches.open(REVALIDATED_AT_CACHE);
  await cache.put(getDictionaryUrl(locale), new Response(String(timestamp)));
}

export async function clearRevalidatedAt(locale: Locale): Promise<void> {
  timestamps[locale] = 0;
  const cache = await caches.open(REVALIDATED_AT_CACHE);
  await cache.delete(getDictionaryUrl(locale));
}

async function readPersistedRevalidatedAt(locale: Locale): Promise<number> {
  const cache = await caches.open(REVALIDATED_AT_CACHE);
  const response = await cache.match(getDictionaryUrl(locale));
  const timestamp = Number(await response?.text());
  return Number.isFinite(timestamp) ? timestamp : 0;
}
