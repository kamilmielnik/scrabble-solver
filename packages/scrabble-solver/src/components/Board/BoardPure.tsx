import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import { FunctionComponent, KeyboardEventHandler, memo, Ref, RefObject } from 'react';

import styles from './Board.module.scss';
import { Cell as CellComponent } from './components';

interface Props {
  className?: string;
  cellSize: number;
  center: Cell;
  innerRef?: Ref<HTMLDivElement>;
  lastDirection: 'horizontal' | 'vertical';
  refs: RefObject<HTMLInputElement>[][];
  rows: Cell[][];
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  cellSize,
  center,
  innerRef,
  lastDirection,
  refs,
  rows,
  onDirectionToggle,
  onFocus,
  onKeyDown,
}) => (
  <div className={classNames(styles.board, className)} ref={innerRef} onKeyDown={onKeyDown}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <CellComponent
            className={styles.cell}
            cell={cell}
            direction={lastDirection}
            inputRef={refs[y][x]}
            isCenter={center.x === x && center.y === y}
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
