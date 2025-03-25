import { Workbox } from 'workbox-window';

let serviceWorker: Workbox | null = null;

export const registerServiceWorker = async () => {
  if (!globalThis.navigator || !('serviceWorker' in globalThis.navigator)) {
    return;
  }

  serviceWorker = new Workbox('/service-worker.js');
  await serviceWorker.register({ immediate: true });
};

export const getServiceWorker = async (): Promise<Workbox | null> => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (serviceWorker) {
    return serviceWorker;
  }

  await registerServiceWorker();

  return serviceWorker;
};
