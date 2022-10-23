import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  memo,
  Ref,
  RefObject,
} from 'react';

import { Direction } from 'types';

import styles from './Board.module.scss';
import { Cell as CellComponent } from './components';

interface Props {
  className?: string;
  cellSize: number;
  center: Cell;
  direction: Direction;
  innerRef?: Ref<HTMLDivElement>;
  refs: RefObject<HTMLInputElement>[][];
  rows: Cell[][];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  cellSize,
  center,
  direction,
  innerRef,
  refs,
  rows,
  onChange,
  onDirectionToggle,
  onFocus,
  onKeyDown,
  onPaste,
}) => (
  <div className={classNames(styles.board, className)} ref={innerRef} onKeyDown={onKeyDown} onPaste={onPaste}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <CellComponent
            className={styles.cell}
            cell={cell}
            direction={direction}
            inputRef={refs[y][x]}
            isCenter={center.x === x && center.y === y}
            key={x}
            size={cellSize}
            onChange={onChange}
            onDirectionToggle={onDirectionToggle}
            onFocus={onFocus}
          />
        ))}
      </div>
    ))}
  </div>
);

export default memo(BoardPure);
