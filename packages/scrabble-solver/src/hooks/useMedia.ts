import { useCallback, useSyncExternalStore } from 'react';

export const useMedia = (query: string, defaultState = false) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = getMediaQueryList(query);
      mediaQueryList.addEventListener('change', onChange);

      return () => {
        mediaQueryList.removeEventListener('change', onChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => getMediaQueryList(query).matches, [query]);
  const getServerSnapshot = useCallback(() => defaultState, [defaultState]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

// cache because matchMedia returns a new MediaQueryList on every call
const mediaQueryLists = new Map<string, MediaQueryList>();

function getMediaQueryList(query: string): MediaQueryList {
  let mediaQueryList = mediaQueryLists.get(query);

  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(query);
    mediaQueryLists.set(query, mediaQueryList);
  }

  return mediaQueryList;
}
