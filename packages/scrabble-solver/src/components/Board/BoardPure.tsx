import { BLANK, EMPTY_CELL } from '@scrabble-solver/constants';
import {
  type Cell as CellModel,
  type Config,
  type Locale,
  type ShowCoordinates,
  type TextDirection,
} from '@scrabble-solver/types';
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

import Ban from '@/icons/Ban.svg';
import FlagFill from '@/icons/FlagFill.svg';
import { getCoordinate } from '@/lib/getCoordinate';
import { type CellFilter, type Translate } from '@/types';

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellFilters: CellFilter[];
  config: Config;
  direction: TextDirection;
  hoveredCharacter: string | null;
  hoveredWordCells: boolean[][] | null;
  inputRefs: RefObject<HTMLInputElement | null>[][];
  locale: Locale;
  reachableCells: boolean[][] | null;
  rows: CellModel[][];
  showCoordinates: ShowCoordinates;
  style?: CSSProperties;
  translate: Translate;
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
      config,
      direction,
      cellFilters,
      hoveredCharacter,
      hoveredWordCells,
      inputRefs,
      locale,
      reachableCells,
      rows,
      showCoordinates,
      style,
      translate,
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
      <div />

      {rows[0].map((_column, index) => (
        <div className={styles.coordinate} key={index}>
          {getCoordinate(index, showCoordinates === 'original' ? 'letter' : 'number')}
        </div>
      ))}

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
          <div className={styles.coordinate}>
            {getCoordinate(y, showCoordinates === 'original' ? 'number' : 'letter')}
          </div>

          {cells.map((cell, x) => {
            const isHoveredWord = hoveredWordCells ? hoveredWordCells[y][x] : false;

            return (
              <Cell
                cell={cell}
                cellBottom={y < rows.length - 1 ? rows[y + 1][x] : undefined}
                cellLeft={x > 0 ? rows[y][x - 1] : undefined}
                cellRight={x < rows[y].length - 1 ? rows[y][x + 1] : undefined}
                cellTop={y > 0 ? rows[y - 1][x] : undefined}
                config={config}
                highlighted={cell.isCandidate() || isHoverCharacter(cell, hoveredCharacter) || isHoveredWord}
                inputRef={inputRefs[y][x]}
                isReachable={reachableCells ? reachableCells[y][x] : true}
                key={x}
                locale={locale}
                showCoordinates={showCoordinates}
                translate={translate}
                onChange={onChange}
                onFocus={onFocus}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  ),
);

export const BoardPure = memo(BoardPureBase);

function isHoverCharacter(cell: CellModel, hoveredCharacter: string | null): boolean {
  if (cell.tile.character === EMPTY_CELL || hoveredCharacter === null) {
    return false;
  }

  return hoveredCharacter === BLANK
    ? cell.tile.isBlank
    : !cell.tile.isBlank && cell.tile.character === hoveredCharacter;
}

function inlineOffset(index: number) {
  return `calc(var(--coordinate-size) + var(--border--width) + ${index} * (var(--cell-size) + var(--border--width)))`;
}
