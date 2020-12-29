import React, { FunctionComponent } from 'react';

import { selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import { Cell } from './components';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
}

const Board: FunctionComponent<Props> = ({ cellSize }) => {
  const rows = useTypedSelector(selectRowsWithCandidate);
  const [{ refs }, { onFocus, onKeyDown, onMoveFocus }] = useGrid(rows[0].length, rows.length);

  return (
    <div className={styles.board}>
      {rows.map((cells, y) => (
        <div className={styles.row} key={y}>
          {cells.map((cell, x) => (
            <Cell
              className={styles.cell}
              cell={cell}
              key={x}
              ref={refs[y][x]}
              size={cellSize}
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
