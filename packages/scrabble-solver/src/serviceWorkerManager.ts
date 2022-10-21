import { Workbox } from 'workbox-window';

let serviceWorker: Workbox | null = null;

export const registerServiceWorker = () => {
  if (!globalThis.navigator || !('serviceWorker' in globalThis.navigator)) {
    return;
  }

  serviceWorker = new Workbox('/service-worker.js');
  serviceWorker.register({ immediate: true });
};

export const getServiceWorker = (): Workbox | null => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (serviceWorker) {
    return serviceWorker;
  }

  registerServiceWorker();

  return serviceWorker;
};
