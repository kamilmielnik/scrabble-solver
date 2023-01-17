import { useLayoutEffect } from 'react';

import { noop } from 'lib';

const useLanguage = (language: string) => {
  useLayoutEffect(() => {
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

export default useLanguage;
