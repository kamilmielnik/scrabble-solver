import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  CSSProperties,
  FocusEventHandler,
  Fragment,
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
  inputRefs: RefObject<HTMLInputElement>[][];
  rows: CellModel[][];
  style?: CSSProperties;
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPure: FunctionComponent<Props> = ({
  className,
  cellSize,
  inputRefs,
  rows,
  style,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onPaste,
}) => (
  <div
    className={classNames(styles.board, className)}
    style={style}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
  >
    {rows.map((cells, y) => (
      <Fragment key={y}>
        {cells.map((cell, x) => (
          <Cell
            className={styles.cell}
            cell={cell}
            cellBottom={y < rows.length - 1 ? rows[y + 1][x] : undefined}
            cellLeft={x > 0 ? rows[y][x - 1] : undefined}
            cellRight={x < rows.length - 1 ? rows[y][x + 1] : undefined}
            cellTop={y > 0 ? rows[y - 1][x] : undefined}
            inputRef={inputRefs[y][x]}
            key={x}
            size={cellSize}
            onChange={onChange}
            onFocus={onFocus}
          />
        ))}
      </Fragment>
    ))}
  </div>
);

export default memo(BoardPure);
