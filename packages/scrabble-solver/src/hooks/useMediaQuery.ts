import { buildMediaQuery } from 'include-media-query-builder';

import { BREAKPOINTS } from 'parameters';

import { useMedia } from './useMedia';

export const useMediaQuery = (query: string | string[], defaultState?: boolean | undefined): boolean => {
  const mediaQuery = buildMediaQuery(BREAKPOINTS, query);
  return useMedia(mediaQuery, defaultState);
};
