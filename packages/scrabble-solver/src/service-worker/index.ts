/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import { isPrefetchDictionaryMessage } from '@/types';

import { revalidateDictionary } from './dictionaries';
import { routeSolveRequests } from './routeSolveRequests';
import { routeVerifyRequests } from './routeVerifyRequests';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (isPrefetchDictionaryMessage(event.data)) {
    event.waitUntil(revalidateDictionary(event.data.locale));
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
