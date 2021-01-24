import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import React, { FunctionComponent, KeyboardEventHandler, memo, RefObject } from 'react';

import styles from './Board.module.scss';
import { Cell as CellComponent } from './components';

interface Props {
  className?: string;
  cellSize: number;
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
  rows: Cell[][];
  onFocus: (x: number, y: number) => void;
  onDirectionToggle: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  lastDirection,
  refs,
  rows,
  cellSize,
  onDirectionToggle,
  onFocus,
  onKeyDown,
}) => (
  <div className={classNames(styles.board, className)} onKeyDown={onKeyDown}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <CellComponent
            className={styles.cell}
            cell={cell}
            direction={lastDirection}
            inputRef={refs[y][x]}
            key={x}
            size={cellSize}
            onDirectionToggle={onDirectionToggle}
            onFocus={onFocus}
          />
        ))}
      </div>
    ))}
  </div>
);

export default memo(BoardPure);
