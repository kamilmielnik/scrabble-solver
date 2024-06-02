import { Cell as CellModel, ShowCoordinates } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  CSSProperties,
  ChangeEventHandler,
  ClipboardEventHandler,
  FocusEventHandler,
  Fragment,
  KeyboardEventHandler,
  RefObject,
  forwardRef,
  memo,
} from 'react';

import { FlagFill } from 'icons';
import { BORDER_WIDTH } from 'parameters';
import { Point } from 'types';

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellSize: number;
  coordinatesSize: number;
  filteredCells: Point[];
  inputRefs: RefObject<HTMLInputElement>[][];
  rows: CellModel[][];
  showCoordinates: ShowCoordinates;
  style?: CSSProperties;
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const getCoordinate = (index: number, type: 'letter' | 'number'): string => {
  if (type === 'number') {
    return String(index + 1);
  }

  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index];
};

const BoardPure = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      cellSize,
      coordinatesSize,
      filteredCells,
      inputRefs,
      rows,
      showCoordinates,
      style,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onPaste,
    },
    ref,
  ) => (
    <div
      className={classNames(styles.board, className)}
      ref={ref}
      style={style}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    >
      {showCoordinates !== 'hidden' && (
        <>
          <div style={{ width: coordinatesSize, height: coordinatesSize }} />

          {rows[0].map((_column, index) => (
            <div className={styles.coordinateColumn} key={index} style={{ width: cellSize, height: coordinatesSize }}>
              {getCoordinate(index, showCoordinates === 'original' ? 'letter' : 'number')}
            </div>
          ))}
        </>
      )}

      {rows.map((cells, y) => (
        <Fragment key={y}>
          {showCoordinates !== 'hidden' && (
            <div className={styles.coordinateRow} style={{ width: coordinatesSize, height: cellSize }}>
              {getCoordinate(y, showCoordinates === 'original' ? 'number' : 'letter')}
            </div>
          )}

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

      {filteredCells.map(({ x, y }) => (
        <div
          className={styles.iconContainer}
          key={[x, y].join('-')}
          style={{
            height: cellSize,
            width: cellSize,
            left: coordinatesSize + x * (cellSize + BORDER_WIDTH),
            top: coordinatesSize + y * (cellSize + BORDER_WIDTH),
          }}
        >
          <div className={styles.iconBackground} />
          <FlagFill className={styles.icon} />
        </div>
      ))}
    </div>
  ),
);

export default memo(BoardPure);
