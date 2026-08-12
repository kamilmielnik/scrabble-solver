import { useEffect } from 'react';

import { noop } from '@/lib/noop';

export const useLanguage = (language: string) => {
  useEffect(() => {
    const html = document.body.parentElement;

    if (!html) {
      return noop;
    }

    const old = html.lang;
    html.lang = language;

    return () => {
      html.lang = old;
    };
  }, [language]);
};
