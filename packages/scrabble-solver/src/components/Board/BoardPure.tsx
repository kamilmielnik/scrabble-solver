import { Cell as CellModel } from '@scrabble-solver/types';
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

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellSize: number;
  center: CellModel;
  innerRef?: Ref<HTMLDivElement>;
  inputRefs: RefObject<HTMLInputElement>[][];
  rows: CellModel[][];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  cellSize,
  center,
  innerRef,
  inputRefs,
  rows,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
}) => (
  <div className={classNames(styles.board, className)} ref={innerRef} onKeyDown={onKeyDown} onPaste={onPaste}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <Cell
            className={styles.cell}
            cell={cell}
            inputRef={inputRefs[y][x]}
            isBottom={y === rows.length - 1}
            isCenter={center.x === x && center.y === y}
            isRight={x === cells.length - 1}
            key={x}
            size={cellSize}
            onChange={onChange}
            onFocus={onFocus}
          />
        ))}
      </div>
    ))}
  </div>
);

export default memo(BoardPure);
