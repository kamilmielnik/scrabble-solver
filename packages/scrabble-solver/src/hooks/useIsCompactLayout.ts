import { BREAKPOINT_HEIGHT_L } from '@/parameters';

import { useMedia } from './useMedia';
import { useMediaQuery } from './useMediaQuery';

const SHORT_VIEWPORT = `(max-height: ${BREAKPOINT_HEIGHT_L - 1}px)`;

// Keep in sync with the `compact` media expression in styles/mixins.scss
export function useIsCompactLayout(): boolean {
  const isNarrowViewport = useMediaQuery('<l');
  const isShortViewport = useMedia(SHORT_VIEWPORT);

  return isNarrowViewport || isShortViewport;
}
