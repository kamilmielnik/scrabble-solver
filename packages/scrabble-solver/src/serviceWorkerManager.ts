import { type Locale } from '@scrabble-solver/types';
import { Workbox } from 'workbox-window';

import { createPrefetchDictionaryMessage } from '@/types';

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

/**
 * Asks the service worker to download the locale's dictionary ahead of the
 * first solve, so solving works locally (and offline) from the start.
 * Opportunistic - when it fails, the dictionary still arrives with the first
 * solve's revalidation.
 */
export const prefetchDictionary = async (locale: Locale): Promise<void> => {
  try {
    if (!(await getServiceWorker())) {
      return;
    }

    const registration = await globalThis.navigator.serviceWorker.ready;
    registration.active?.postMessage(createPrefetchDictionaryMessage(locale));
  } catch {
    // do nothing
  }
};
