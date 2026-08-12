import { type Cell as CellModel, type ShowCoordinates, type TextDirection } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  type CSSProperties,
  type ChangeEventHandler,
  type ClipboardEventHandler,
  type FocusEventHandler,
  Fragment,
  type KeyboardEventHandler,
  type RefObject,
  forwardRef,
  memo,
} from 'react';

import { Ban, FlagFill } from '@/icons';
import { getCoordinate } from '@/lib';
import { type CellFilter } from '@/types';

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellFilters: CellFilter[];
  direction: TextDirection;
  inputRefs: RefObject<HTMLInputElement | null>[][];
  reachableCells: boolean[][] | null;
  rows: CellModel[][];
  showCoordinates: ShowCoordinates;
  style?: CSSProperties;
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPureBase = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      direction,
      cellFilters,
      inputRefs,
      reachableCells,
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
      data-testid="board"
      ref={ref}
      style={style}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    >
      {showCoordinates !== 'hidden' && (
        <>
          <div />

          {rows[0].map((_column, index) => (
            <div className={styles.coordinate} key={index}>
              {getCoordinate(index, showCoordinates === 'original' ? 'letter' : 'number')}
            </div>
          ))}
        </>
      )}

      {/* The dynamic changes to the board presentation need to be outside of useBackgroundImage
        to prevent flickering on blob URL change (i.e. when flagging a field,
        but not when changing game type since user's attention is not on the board
        when that happens)*/}
      {cellFilters.map(({ x, y, type }) => {
        const Icon = type === 'exclude' ? Ban : FlagFill;

        return (
          <div
            className={styles.iconContainer}
            key={[x, y].join('-')}
            style={{
              height: 'var(--cell-size)',
              width: 'var(--cell-size)',
              left: direction === 'ltr' ? inlineOffset(x) : undefined,
              right: direction === 'rtl' ? inlineOffset(x) : undefined,
              top: inlineOffset(y),
            }}
          >
            <div className={styles.iconBackground} />
            <Icon aria-hidden="true" className={styles.icon} role="img" />
          </div>
        );
      })}

      {rows.map((cells, y) => (
        <Fragment key={y}>
          {showCoordinates !== 'hidden' && (
            <div className={styles.coordinate}>
              {getCoordinate(y, showCoordinates === 'original' ? 'number' : 'letter')}
            </div>
          )}

          {cells.map((cell, x) => (
            <Cell
              cell={cell}
              cellBottom={y < rows.length - 1 ? rows[y + 1][x] : undefined}
              cellLeft={x > 0 ? rows[y][x - 1] : undefined}
              cellRight={x < rows[y].length - 1 ? rows[y][x + 1] : undefined}
              cellTop={y > 0 ? rows[y - 1][x] : undefined}
              inputRef={inputRefs[y][x]}
              isReachable={reachableCells ? reachableCells[y][x] : true}
              key={x}
              onChange={onChange}
              onFocus={onFocus}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
);

export const BoardPure = memo(BoardPureBase);

function inlineOffset(index: number) {
  return `calc(var(--coordinate-size) + var(--border--width) + ${index} * (var(--cell-size) + var(--border--width)))`;
}
