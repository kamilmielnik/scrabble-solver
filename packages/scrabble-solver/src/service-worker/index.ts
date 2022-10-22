/// <reference lib="WebWorker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import routeSolveRequests from './routeSolveRequests';
import routeVerifyRequests from './routeVerifyRequests';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  routeSolveRequests();
  routeVerifyRequests();
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

cleanupOutdatedCaches();
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
