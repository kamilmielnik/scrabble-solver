import { useCallback, useSyncExternalStore } from 'react';

export const useMedia = (query: string, defaultState = false) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);

      return () => {
        mediaQuery.removeEventListener('change', onChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => defaultState, [defaultState]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
