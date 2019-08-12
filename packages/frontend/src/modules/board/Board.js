import React from 'react';

import { useGrid, useRows } from './hooks';
import Cell from './Cell';
import styles from './Board.module.scss';

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
