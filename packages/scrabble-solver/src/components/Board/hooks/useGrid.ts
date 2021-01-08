import { createRef, KeyboardEventHandler, RefObject, useCallback, useMemo, useState, useRef } from 'react';

import { createKeyboardNavigation } from 'lib';

import { createGridOf } from '../lib';

interface Parameters {
  autoDirectionChange?: boolean;
  height: number;
  width: number;
}

interface State {
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
}

interface Actions {
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler;
  onMoveFocus: () => void;
}

const useGrid = ({ autoDirectionChange, height, width }: Parameters): [State, Actions] => {
  const refs = useMemo(
    () => createGridOf<RefObject<HTMLInputElement>>(width, height, () => createRef()),
    [width, height],
  );
  const activeIndex = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [lastDirection, setLastDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      const x = Math.min(Math.max(activeIndex.current.x + offsetX, 0), width - 1);
      const y = Math.min(Math.max(activeIndex.current.y + offsetY, 0), height - 1);
      activeIndex.current = { x, y };
      refs[y][x].current?.focus();
    },
    [activeIndex, height, refs, width],
  );

  const onFocus = useCallback(
    (x, y) => {
      activeIndex.current = { x, y };
    },
    [activeIndex],
  );

  const onMoveFocus = useCallback(() => {
    if (lastDirection === 'horizontal') {
      changeActiveIndex(1, 0);
    } else if (lastDirection === 'vertical') {
      changeActiveIndex(0, 1);
    }
  }, [changeActiveIndex, lastDirection]);

  const onKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onArrowDown: (event) => {
          if (!event.ctrlKey && !event.metaKey) {
            changeActiveIndex(0, 1);
          }

          if (autoDirectionChange) {
            setLastDirection('vertical');
          }
        },
        onArrowLeft: (event) => {
          if (!event.ctrlKey && !event.metaKey) {
            changeActiveIndex(-1, 0);
          }

          if (autoDirectionChange) {
            setLastDirection('horizontal');
          }
        },
        onArrowRight: (event) => {
          if (!event.ctrlKey && !event.metaKey) {
            changeActiveIndex(1, 0);
          }

          if (autoDirectionChange) {
            setLastDirection('horizontal');
          }
        },
        onArrowUp: (event) => {
          if (!event.ctrlKey && !event.metaKey) {
            changeActiveIndex(0, -1);
          }

          if (autoDirectionChange) {
            setLastDirection('vertical');
          }
        },
      }),
    [changeActiveIndex, autoDirectionChange],
  );

  return [
    { lastDirection, refs },
    { onFocus, onKeyDown, onMoveFocus },
  ];
};

export default useGrid;
