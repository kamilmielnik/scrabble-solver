import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { expirationManager } from './expirationManager';
import { getDictionaryUrl } from './getDictionaryUrl';
import { clearRevalidatedAt, readRevalidatedAt, writeRevalidatedAt } from './revalidatedAt';

const REVALIDATION_INTERVAL = 60 * 60 * 1000;

const requests: Partial<Record<Locale, Promise<void> | undefined>> = {};
const resetWhileRevalidating = new Set<Locale>();

export function revalidateDictionary(locale: Locale): Promise<void> {
  const inFlight = requests[locale];

  if (inFlight) {
    return inFlight;
  }

  // Registered before the first await, so concurrent callers share this request.
  const request = revalidateWhenStale(locale).finally(() => {
    requests[locale] = undefined;
  });

  requests[locale] = request;
  return request;
}

/**
 * Lets the next access revalidate immediately - used when the cached dictionary
 * is deleted, so its replacement is not stuck behind the throttle.
 * A revalidation already in flight when this runs saw the deleted entry, so it
 * must not arm the throttle when it finishes.
 */
export async function resetRevalidationThrottle(locale: Locale): Promise<void> {
  resetWhileRevalidating.add(locale);
  await clearRevalidatedAt(locale);
}

async function revalidateWhenStale(locale: Locale): Promise<void> {
  if (Date.now() - (await readRevalidatedAt(locale)) < REVALIDATION_INTERVAL) {
    return;
  }

  resetWhileRevalidating.delete(locale);
  await revalidate(locale);

  if (!resetWhileRevalidating.has(locale)) {
    await writeRevalidatedAt(locale, Date.now());
  }
}

/**
 * `no-cache` revalidates against the server without letting the HTTP cache
 * answer, while still allowing a 304 that keeps the multi-megabyte cached body
 * untouched; only a real 200 rewrites it. `no-store` would look equivalent but
 * makes the browser send `Cache-Control: no-cache`, which Next.js reads as an
 * unconditional request and answers with the whole body every time.
 */
async function revalidate(locale: Locale): Promise<void> {
  await expirationManager.expireEntries();

  const url = getDictionaryUrl(locale);
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);
  const etag = cached?.headers.get('etag');
  const response = await fetch(url, {
    cache: 'no-cache',
    headers: etag ? { 'If-None-Match': etag } : {},
  });

  if (response.status === 304) {
    await expirationManager.updateTimestamp(url);
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  await cache.put(url, response);
  await expirationManager.updateTimestamp(url);
}
