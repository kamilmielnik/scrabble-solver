import { useEffect } from 'react';

import { noop } from 'lib';

export const useDirection = (direction: 'ltr' | 'rtl') => {
  useEffect(() => {
    const html = document.body.parentElement;

    if (!html) {
      return noop;
    }

    const old = html.dir;
    html.dir = direction;

    return () => {
      html.dir = old;
    };
  }, [direction]);
};
