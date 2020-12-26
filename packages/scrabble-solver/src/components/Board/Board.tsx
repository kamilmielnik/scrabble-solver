import React, { FunctionComponent} from 'react';

import styles from './Board.module.scss';
import Cell from './Cell';
import { useGrid, useRows } from './hooks';

const Board: FunctionComponent = () => {
  const rows = useRows();
  const [{ refs }, { onFocus, onKeyDown, onMoveFocus }] = useGrid(rows[0].length, rows.length);

  return (
    <div className={styles.board}>
      {rows.map((cells, y) => (
        <div className={styles.row} key={y}>
          {cells.map((cell, x) => (
            <Cell
              cell={cell}
              key={x}
              ref={refs[y][x]}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              onMoveFocus={onMoveFocus}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
