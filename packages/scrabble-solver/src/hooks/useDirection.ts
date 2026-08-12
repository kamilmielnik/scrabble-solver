import { type TextDirection } from '@scrabble-solver/types';
import { useEffect } from 'react';

import { noop } from '@/lib/noop';

export const useDirection = (direction: TextDirection) => {
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
