import React from 'react';

import { useGrid, useRows } from './hooks';
import Cell from './Cell';
import styles from './Board.module.scss';

const Board = () => {
  const rows = useRows();
  const [{ refs }, { onFocus, onKeyDown }] = useGrid(rows[0].length, rows.length);

  return (
    <div className={styles.board}>
      {rows.map((cells, y) => (
        <div className={styles.row} key={y}>
          {cells.map((cell, x) => (
            <Cell cell={cell} key={x} ref={refs[y][x]} onFocus={onFocus} onKeyDown={onKeyDown} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
