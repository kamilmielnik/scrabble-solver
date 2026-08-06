import { Workbox } from 'workbox-window';

export const registerServiceWorker = async () => {
  if (!globalThis.navigator || !('serviceWorker' in globalThis.navigator)) {
    return;
  }

  await new Workbox('/service-worker.js').register({ immediate: true });
};
