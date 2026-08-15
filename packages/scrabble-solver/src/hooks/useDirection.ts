import { type TextDirection } from '@scrabble-solver/types';
import { useEffect } from 'react';

import { noop } from '@/lib/noop';

export const useDirection = (direction: TextDirection) => {
  useEffect(() => {
    const html = document.body.parentElement;

    if (!html || html.dir === direction) {
      return noop;
    }

    const old = html.dir;
    html.dir = direction;

    return () => {
      html.dir = old;
    };
  }, [direction]);
};
