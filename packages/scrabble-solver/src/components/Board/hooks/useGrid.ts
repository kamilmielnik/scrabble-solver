import { createRef, KeyboardEventHandler, RefObject, useCallback, useMemo, useState, useRef } from 'react';
import { useLatest } from 'react-use';

import { createKeyboardNavigation, isCtrl } from 'lib';

import { createGridOf } from '../lib';

interface Parameters {
  height: number;
  width: number;
}

interface State {
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
}

interface Actions {
  onFocus: (x: number, y: number) => void;
  onDirectionToggle: () => void;
  onKeyDown: KeyboardEventHandler;
  onMoveFocus: () => void;
}

const useGrid = ({ height, width }: Parameters): [State, Actions] => {
  const refs = useMemo(
    () => createGridOf<RefObject<HTMLInputElement>>(width, height, () => createRef()),
    [width, height],
  );
  const activeIndexRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [lastDirection, setLastDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const lastDirectionRef = useLatest(lastDirection);

  const changeActiveIndexRef = useLatest((offsetX, offsetY) => {
    const x = Math.min(Math.max(activeIndexRef.current.x + offsetX, 0), width - 1);
    const y = Math.min(Math.max(activeIndexRef.current.y + offsetY, 0), height - 1);
    activeIndexRef.current = { x, y };
    refs[y][x].current?.focus();
  });

  const onDirectionToggle = useCallback(() => {
    setLastDirection((direction) => {
      return direction === 'vertical' ? 'horizontal' : 'vertical';
    });
  }, []);

  const onFocus = useCallback((x, y) => {
    activeIndexRef.current = { x, y };
  }, []);

  const onMoveFocus = useCallback(() => {
    if (lastDirectionRef.current === 'horizontal') {
      changeActiveIndexRef.current(1, 0);
    } else if (lastDirectionRef.current === 'vertical') {
      changeActiveIndexRef.current(0, 1);
    }
  }, [changeActiveIndexRef, lastDirectionRef]);

  const onKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onArrowDown: (event) => {
          if (isCtrl(event)) {
            setLastDirection('vertical');
          } else {
            changeActiveIndexRef.current(0, 1);
          }
        },
        onArrowLeft: (event) => {
          if (isCtrl(event)) {
            setLastDirection('horizontal');
          } else {
            changeActiveIndexRef.current(-1, 0);
          }
        },
        onArrowRight: (event) => {
          if (isCtrl(event)) {
            setLastDirection('horizontal');
          } else {
            changeActiveIndexRef.current(1, 0);
          }
        },
        onArrowUp: (event) => {
          if (isCtrl(event)) {
            setLastDirection('vertical');
          } else {
            changeActiveIndexRef.current(0, -1);
          }
        },
      }),
    [changeActiveIndexRef],
  );

  return [
    { lastDirection, refs },
    { onDirectionToggle, onFocus, onKeyDown, onMoveFocus },
  ];
};

export default useGrid;
