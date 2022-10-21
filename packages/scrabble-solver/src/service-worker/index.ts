/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import routeSolveRequests from './routeSolveRequests';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  self.skipWaiting();
});

cleanupOutdatedCaches();
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
routeSolveRequests();
