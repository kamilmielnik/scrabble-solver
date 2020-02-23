import { createRef, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { createKeyboardNavigation } from 'utils';

import { createSelectBonus, createSelectCharacterPoints, selectRowsWithCandidate } from './selectors';
import { createGridOf } from './utils';

export const useRows = () => useSelector(selectRowsWithCandidate);

export const useBonus = (cell) => {
  const selectBonus = useMemo(() => createSelectBonus(), []);
  return useSelector((state) => selectBonus(state, cell));
};

export const useCharacterPoints = (cell) => {
  const selectCharacterPoints = useMemo(() => createSelectCharacterPoints(), []);
  return useSelector((state) => selectCharacterPoints(state, cell));
};

export const useGrid = (width, height) => {
  const refs = useMemo(() => createGridOf(width, height, () => createRef()), [width, height]);
  const activeIndex = useRef({ x: null, y: null });
  const lastDirectionRef = useRef('horizontal');

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      activeIndex.current = {
        x: Math.min(Math.max(activeIndex.current.x + offsetX, 0), width - 1),
        y: Math.min(Math.max(activeIndex.current.y + offsetY, 0), height - 1)
      };
      refs[activeIndex.current.y][activeIndex.current.x].current.focus();
    },
    [activeIndex, refs, width, height]
  );

  const onFocus = useCallback(
    (x, y) => {
      activeIndex.current = { x, y };
    },
    [activeIndex]
  );

  const onMoveFocus = useCallback(() => {
    if (lastDirectionRef.current === 'horizontal') {
      changeActiveIndex(1, 0);
    } else if (lastDirectionRef.current === 'vertical') {
      changeActiveIndex(0, 1);
    }
  }, [changeActiveIndex]);

  const onKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onArrowDown: () => {
          changeActiveIndex(0, 1);
          lastDirectionRef.current = 'vertical';
        },
        onArrowLeft: () => {
          changeActiveIndex(-1, 0);
          lastDirectionRef.current = 'horizontal';
        },
        onArrowRight: () => {
          changeActiveIndex(1, 0);
          lastDirectionRef.current = 'horizontal';
        },
        onArrowUp: () => {
          changeActiveIndex(0, -1);
          lastDirectionRef.current = 'vertical';
        }
      }),
    [changeActiveIndex]
  );

  return [{ refs }, { onFocus, onKeyDown, onMoveFocus }];
};
