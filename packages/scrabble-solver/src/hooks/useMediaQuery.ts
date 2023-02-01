import { buildMediaQuery } from 'include-media-query-builder';
import { useMedia } from 'react-use';

import { BREAKPOINTS } from 'parameters';

const useMediaQuery = (query: string | string[], defaultState?: boolean | undefined): boolean => {
  const mediaQuery = buildMediaQuery(BREAKPOINTS, query);
  return useMedia(mediaQuery, defaultState);
};

export default useMediaQuery;
