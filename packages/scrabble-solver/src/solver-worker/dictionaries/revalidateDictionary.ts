import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { expirationManager } from './expirationManager';
import { getDictionaryUrl } from './getDictionaryUrl';

const REVALIDATION_INTERVAL = 60 * 60 * 1000;

const requests: Partial<Record<Locale, Promise<void> | undefined>> = {};
const revalidatedAt: Partial<Record<Locale, number>> = {};
const resetWhileRevalidating = new Set<Locale>();

export async function revalidateDictionary(locale: Locale): Promise<void> {
  if (requests[locale] instanceof Promise) {
    return;
  }

  if (Date.now() - (revalidatedAt[locale] ?? 0) < REVALIDATION_INTERVAL) {
    return;
  }

  resetWhileRevalidating.delete(locale);
  const request = revalidate(locale);
  requests[locale] = request;

  try {
    await request;

    if (!resetWhileRevalidating.has(locale)) {
      revalidatedAt[locale] = Date.now();
    }
  } finally {
    requests[locale] = undefined;
  }
}

/**
 * Lets the next access revalidate immediately - used when the cached dictionary
 * is deleted, so its replacement is not stuck behind the throttle.
 * A revalidation already in flight when this runs saw the deleted entry, so it
 * must not arm the throttle when it finishes.
 */
export function resetRevalidationThrottle(locale: Locale): void {
  revalidatedAt[locale] = undefined;
  resetWhileRevalidating.add(locale);
}

/**
 * Bypasses the HTTP cache (`no-store`) so the conditional request reaches the
 * server and the Cache API stays the single source of truth. A 304 keeps the
 * multi-megabyte cached body untouched; only a real 200 rewrites it.
 */
async function revalidate(locale: Locale): Promise<void> {
  await expirationManager.expireEntries();

  const url = getDictionaryUrl(locale);
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);
  const etag = cached?.headers.get('etag');
  const response = await fetch(url, {
    cache: 'no-store',
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
