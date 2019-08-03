import React, { createRef, useCallback, useMemo, useState } from 'react';

import { createKeyboardNavigation } from 'utils';

import { useRows } from './hooks';
import Cell from './Cell';
import styles from './Board.module.scss';

const Board = () => {
  const rows = useRows();
  const cellsRefs = useMemo(() => rows.map((row) => row.map(() => createRef())), [rows]);
  const [activeIndexX, setActiveIndexX] = useState(null);
  const [activeIndexY, setActiveIndexY] = useState(null);

  const changeActiveIndex = useCallback(
    (offsetX, offsetY) => {
      const nextActiveIndexX = Math.min(Math.max(activeIndexX + offsetX, 0), rows[0].length - 1);
      const nextActiveIndexY = Math.min(Math.max(activeIndexY + offsetY, 0), rows.length - 1);
      cellsRefs[nextActiveIndexY][nextActiveIndexX].current.focus();
      setActiveIndexX(nextActiveIndexX);
      setActiveIndexY(nextActiveIndexY);
    },
    [activeIndexX, activeIndexY, cellsRefs, rows]
  );

  const onFocus = useCallback((cell) => {
    setActiveIndexX(cell.x);
    setActiveIndexY(cell.y);
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

  return (
    <div className={styles.board}>
      {rows.map((cells, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {cells.map((cell, cellIndex) => (
            <Cell
              cell={cell}
              key={cellIndex}
              ref={cellsRefs[rowIndex][cellIndex]}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
