import { type Locale } from '@scrabble-solver/types';
import { useEffect } from 'react';

import { prefetchDictionary } from '@/serviceWorkerManager';

/**
 * Re-warms the service worker's dictionary when the user returns to the tab.
 * The browser stops an idle worker after ~30 seconds, so without this the
 * first solve after a pause pays the dictionary cold-start cost.
 */
export const usePrefetchDictionaryOnReturn = (locale: Locale) => {
  useEffect(() => {
    const handleReturn = () => {
      if (!document.hidden) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        prefetchDictionary(locale);
      }
    };

    window.addEventListener('focus', handleReturn);
    document.addEventListener('visibilitychange', handleReturn);

    return () => {
      window.removeEventListener('focus', handleReturn);
      document.removeEventListener('visibilitychange', handleReturn);
    };
  }, [locale]);
};
