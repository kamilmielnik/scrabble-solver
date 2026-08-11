import { useSyncExternalStore } from 'react';

/**
 * SSR-visible elements must not derive sizes from this hook - they should be sized in CSS.
 */
export const useViewportSize = () => {
  const viewportHeight = useSyncExternalStore(subscribeToResize, getViewportHeight, getServerSize);
  const viewportWidth = useSyncExternalStore(subscribeToResize, getViewportWidth, getServerSize);

  return { viewportHeight, viewportWidth };
};

function subscribeToResize(onChange: () => void) {
  window.addEventListener('resize', onChange);

  return () => {
    window.removeEventListener('resize', onChange);
  };
}

function getViewportHeight() {
  return window.innerHeight;
}

function getViewportWidth() {
  return window.innerWidth;
}

function getServerSize() {
  return 0;
}
