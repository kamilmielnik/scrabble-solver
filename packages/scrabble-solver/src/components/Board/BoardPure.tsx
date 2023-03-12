import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  memo,
  RefObject,
} from 'react';

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellSize: number;
  center: CellModel;
  inputRefs: RefObject<HTMLInputElement>[][];
  rows: CellModel[][];
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  cellSize,
  center,
  inputRefs,
  rows,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
}) => (
  <div className={classNames(styles.board, className)} onBlur={onBlur} onKeyDown={onKeyDown} onPaste={onPaste}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <Cell
            className={styles.cell}
            cell={cell}
            cellBottom={y < rows.length - 1 ? rows[y + 1][x] : undefined}
            cellLeft={x > 0 ? rows[y][x - 1] : undefined}
            cellRight={x < rows.length - 1 ? rows[y][x + 1] : undefined}
            cellTop={y > 0 ? rows[y - 1][x] : undefined}
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
