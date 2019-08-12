import React, { createRef, useCallback, useMemo, useState } from 'react';

import { createKeyboardNavigation } from 'utils';

import { useRows } from './hooks';
import Cell from './Cell';
import styles from './Board.module.scss';

const createArray = (length) => Array.from({ length });

const useGrid = (width, height) => {
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

const Board = () => {
  const rows = useRows();
  const [{ refs }, { onFocus, onKeyDown }] = useGrid(rows[0].length, rows.length);

  return (
    <div className={styles.board}>
      {rows.map((cells, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {cells.map((cell, cellIndex) => (
            <Cell cell={cell} key={cellIndex} ref={refs[rowIndex][cellIndex]} onFocus={onFocus} onKeyDown={onKeyDown} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
