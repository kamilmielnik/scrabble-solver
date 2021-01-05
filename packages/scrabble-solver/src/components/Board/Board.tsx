import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
import { Cell } from './components';
import { useGrid } from './hooks';

interface Props {
  className?: string;
  cellSize: number;
}

const Board: FunctionComponent<Props> = ({ className, cellSize }) => {
  const rows = useTypedSelector(selectRowsWithCandidate);
  const [{ lastDirection, refs }, { onFocus, onKeyDown, onMoveFocus }] = useGrid(rows[0].length, rows.length);

  return (
    <div className={classNames(styles.board, className)}>
      {rows.map((cells, y) => (
        <div className={styles.row} key={y}>
          {cells.map((cell, x) => (
            <Cell
              className={styles.cell}
              cell={cell}
              direction={lastDirection}
              inputRef={refs[y][x]}
              key={x}
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
