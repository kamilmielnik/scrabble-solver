import React from 'react';

import { useRows } from './hooks';

import Cell from './Cell';
import styles from './Board.module.scss';

const Board = () => {
  const rows = useRows();

  return (
    <div className={styles.board}>
      {rows.map((cells, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {cells.map((cell, cellIndex) => (
            <Cell key={cellIndex} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
