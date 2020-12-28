import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { selectRowsWithCandidate } from 'state';

import styles from './Board.module.scss';
import Cell from './Cell';
import { useGrid } from './hooks';

const Board: FunctionComponent = () => {
  const rows = useSelector(selectRowsWithCandidate);
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
