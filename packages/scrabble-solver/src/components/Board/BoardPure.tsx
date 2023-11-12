import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  CSSProperties,
  FocusEventHandler,
  forwardRef,
  Fragment,
  KeyboardEventHandler,
  memo,
  RefObject,
} from 'react';

import { FlagFill } from 'icons';
import { BORDER_WIDTH } from 'parameters';
import { Point } from 'types';

import styles from './Board.module.scss';
import { Cell } from './components';

import { selectLocale, useTypedSelector } from 'state';
import Locale from '@scrabble-solver/types/build/Locale';
import { coordinates } from './lib';

interface Props {
  className?: string;
  cellSize: number;
  filteredCells: Point[];
  inputRefs: RefObject<HTMLInputElement>[][];
  rows: CellModel[][];
  style?: CSSProperties;
  onBlur: FocusEventHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onPaste: ClipboardEventHandler<HTMLInputElement>;
}

const BoardPure = forwardRef<HTMLDivElement, Props>(
  (
    { className, cellSize, filteredCells, inputRefs, rows, style, onBlur, onChange, onFocus, onKeyDown, onPaste },
    ref,
  ) => {
    const locale = useTypedSelector(selectLocale);
    const isRomanian = locale === Locale.RO_RO;
    return (
      <>
        {isRomanian && (
          <>
            <div className={styles.verticalCoordinates}>
              {coordinates.letters.map((letter) => (
                <div>{letter}</div>
              ))}
            </div>
            <div className={styles.horizontalCoordinates}>
              {coordinates.numbers.map((number) => (
                <div style={{ width: cellSize }}>{number}</div>
              ))}
            </div>
          </>
        )}

        <div
          className={classNames(styles.board, className)}
          ref={ref}
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
          {filteredCells.map(({ x, y }) => (
            <div
              className={styles.iconContainer}
              key={[x, y].join('-')}
              style={{
                height: cellSize,
                width: cellSize,
                left: x * (cellSize + BORDER_WIDTH),
                top: y * (cellSize + BORDER_WIDTH),
              }}
            >
              <div className={styles.iconBackground} />
              <FlagFill className={styles.icon} />
            </div>
          ))}
        </div>
      </>
    );
  },
);

export default memo(BoardPure);
