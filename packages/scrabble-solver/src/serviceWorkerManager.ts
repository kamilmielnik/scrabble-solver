export const registerServiceWorker = async () => {
  if (!globalThis.navigator || !('serviceWorker' in globalThis.navigator)) {
    return;
  }

  const { Workbox } = await import('workbox-window');
  await new Workbox('/service-worker.js').register({ immediate: true });
};
