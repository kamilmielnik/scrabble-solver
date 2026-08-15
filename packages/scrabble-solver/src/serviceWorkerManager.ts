import { waitForIdle } from '@/lib/waitForIdleOrFirstIntent';

export const registerServiceWorker = async () => {
  if (!globalThis.navigator || !('serviceWorker' in globalThis.navigator)) {
    return;
  }

  // Registration waits for load+idle so the install's precache downloads never compete with page resources
  await waitForIdle();
  const { Workbox } = await import('workbox-window');
  await new Workbox('/service-worker.js').register();
};
