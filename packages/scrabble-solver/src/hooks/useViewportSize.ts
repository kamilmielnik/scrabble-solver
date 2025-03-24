import { useCallback, useState } from 'react';

import { useOnWindowResize } from './useOnWindowResize';

export const useViewportSize = () => {
  const [viewportHeight, setViewportHeight] = useState(typeof window === 'undefined' ? 0 : window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth);

  const handleWindowResize = useCallback(() => {
    setViewportHeight(window.innerHeight);
    setViewportWidth(window.innerWidth);
  }, []);

  useOnWindowResize(handleWindowResize);

  return { viewportHeight, viewportWidth };
};
