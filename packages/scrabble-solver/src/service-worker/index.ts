/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import { routeSolveRequests } from './routeSolveRequests';
import { routeVerifyRequests } from './routeVerifyRequests';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  self.clients.claim();
});

cleanupOutdatedCaches();
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
routeSolveRequests();
routeVerifyRequests();
