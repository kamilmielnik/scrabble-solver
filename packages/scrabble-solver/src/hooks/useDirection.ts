import { useLayoutEffect } from 'react';

import { noop } from 'lib';

const useDirection = (direction: 'ltr' | 'rtl') => {
  useLayoutEffect(() => {
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

export default useDirection;
