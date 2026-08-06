/// <reference lib="WebWorker" />

import { type Locale } from '@scrabble-solver/types';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import { isPrefetchDictionaryMessage } from '@/types';

import { revalidateDictionary } from './dictionaries';
import { getGaddag } from './getGaddag';
import { routeSolveRequests } from './routeSolveRequests';
import { routeVerifyRequests } from './routeVerifyRequests';

declare const self: ServiceWorkerGlobalScope;

/**
 * Deserializes the dictionary ahead of the first solve, so it does not pay the
 * cold-start cost. Warms even when revalidation fails (e.g. offline) - a
 * previously cached dictionary can still be deserialized.
 */
const prefetchDictionary = async (locale: Locale): Promise<void> => {
  try {
    await revalidateDictionary(locale);
  } finally {
    await getGaddag(locale);
  }
};

self.addEventListener('install', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (isPrefetchDictionaryMessage(event.data)) {
    event.waitUntil(prefetchDictionary(event.data.locale));
  }
});

self.addEventListener('activate', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.clients.claim();
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
routeSolveRequests();
routeVerifyRequests();
