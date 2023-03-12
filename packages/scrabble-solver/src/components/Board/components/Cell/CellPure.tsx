import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import { ChangeEventHandler, CSSProperties, FocusEventHandler, FunctionComponent, memo, RefObject } from 'react';

import { FlagFill, Star } from 'icons';

import Tile from '../../../Tile';

import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  'aria-label': string;
  bonus: Bonus | undefined;
  cell: Cell;
  cellBottom?: Cell;
  cellLeft?: Cell;
  cellRight?: Cell;
  cellTop?: Cell;
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  isBottom: boolean;
  isCenter: boolean;
  isRight: boolean;
  isEmpty: boolean;
  isFiltered: boolean;
  isValid: boolean;
  points?: number;
  size: number;
  style?: CSSProperties;
  tile: TileModel;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
}

const CellPure: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  bonus,
  cell,
  cellBottom,
  cellLeft,
  cellRight,
  cellTop,
  className,
  inputRef,
  isBottom,
  isCenter,
  isRight,
  isEmpty,
  isFiltered,
  isValid,
  points,
  size,
  style,
  tile,
  onChange,
  onFocus,
}) => (
  <div
    className={classNames(styles.cell, className, getBonusClassname(cell, bonus, isCenter), {
      [styles.bottom]: isBottom,
      [styles.filtered]: isFiltered,
      [styles.right]: isRight,
      [styles.sharpTopLeft]: cellTop?.hasTile() || cellLeft?.hasTile(),
      [styles.sharpTopRight]: cellTop?.hasTile() || cellRight?.hasTile(),
      [styles.sharpBottomLeft]: cellBottom?.hasTile() || cellLeft?.hasTile(),
      [styles.sharpBottomRight]: cellBottom?.hasTile() || cellRight?.hasTile(),
    })}
    style={style}
  >
    {isCenter && isEmpty && !isFiltered && <Star className={styles.icon} />}

    {isFiltered && <FlagFill className={styles.icon} />}

    <Tile
      aria-label={ariaLabel}
      className={styles.tile}
      character={isEmpty ? undefined : tile.character}
      highlighted={cell.isCandidate()}
      inputRef={inputRef}
      isBlank={tile.isBlank}
      isValid={isValid}
      points={points}
      raised={!isEmpty}
      size={size}
      tabIndex={cell.x === 0 && cell.y === 0 ? undefined : -1}
      onChange={onChange}
      onFocus={onFocus}
    />
  </div>
);

export default memo(CellPure);
