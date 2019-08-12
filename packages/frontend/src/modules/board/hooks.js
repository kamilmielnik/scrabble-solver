import { createRef, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createKeyboardNavigation } from 'utils';

import { selectBonus, selectCharacterPoints, selectRowsWithCandidate } from './selectors';
import { createArray } from './utils';

export const useRows = () => useSelector(selectRowsWithCandidate);

export const useBonus = (cell) => useSelector((state) => selectBonus(state, cell));

export const useCharacterPoints = (cell) => useSelector((state) => selectCharacterPoints(state, cell));

export const useGrid = (width, height) => {
  const refs = useMemo(() => createArray(height).map(() => createArray(width).map(() => createRef())), [width, height]);
  const [[activeIndexX, activeIndexY], setActiveIndex] = useState([null, null]);

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      const nextActiveIndexX = Math.min(Math.max(activeIndexX + offsetX, 0), width - 1);
      const nextActiveIndexY = Math.min(Math.max(activeIndexY + offsetY, 0), height - 1);
      setActiveIndex([nextActiveIndexX, nextActiveIndexY]);
      refs[nextActiveIndexY][nextActiveIndexX].current.focus();
    },
    [activeIndexX, activeIndexY, refs, width, height]
  );

  const onFocus = useCallback((cell) => {
    setActiveIndex([cell.x, cell.y]);
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
