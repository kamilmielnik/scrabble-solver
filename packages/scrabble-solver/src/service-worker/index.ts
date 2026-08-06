/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import { cacheAppShell, routeNavigations } from './appShell';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.clients.claim();
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
routeNavigations();
