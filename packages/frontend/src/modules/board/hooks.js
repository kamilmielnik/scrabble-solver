import { createRef, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createKeyboardNavigation } from 'utils';

import { selectBonus, selectCharacterPoints, selectRowsWithCandidate } from './selectors';
import { createArray } from './utils';

export const useRows = () => useSelector(selectRowsWithCandidate);

export const useBonus = (cell) => useSelector((state) => selectBonus(state, cell));

export const useCharacterPoints = (cell) => useSelector((state) => selectCharacterPoints(state, cell));

export const useGrid = (width, height) => {
  const refs = useMemo(() => createArray(height).map(() => createArray(width).map(() => createRef())), [width, height]);
  const activeIndex = useRef({ x: null, y: null });

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      activeIndex.current.x = Math.min(Math.max(activeIndex.current.x + offsetX, 0), width - 1);
      activeIndex.current.y = Math.min(Math.max(activeIndex.current.y + offsetY, 0), height - 1);
      refs[activeIndex.current.y][activeIndex.current.x].current.focus();
    },
    [activeIndex, refs, width, height]
  );

  const onFocus = useCallback((cell) => {
    activeIndex.current.x = cell.x;
    activeIndex.current.y = cell.y;
  }, []);

  const onKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onArrowDown: () => changeActiveIndex(0, 1),
        onArrowLeft: () => changeActiveIndex(-1, 0),
        onArrowRight: () => changeActiveIndex(1, 0),
        onArrowUp: () => changeActiveIndex(0, -1)
      }),
    [changeActiveIndex]
  );

  return [{ refs }, { onFocus, onKeyDown }];
};
