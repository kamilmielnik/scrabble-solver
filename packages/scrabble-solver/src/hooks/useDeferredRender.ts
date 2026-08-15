import { useEffect, useState } from 'react';

/**
 * False during SSR and hydration.
 */
export const useDeferredRender = (): boolean => {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      return setCanRender(true);
    }, 0);

    return () => {
      return window.clearTimeout(timeoutId);
    };
  }, []);

  return canRender;
};
