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
      [styles.candidate]: cell.isCandidate(),
      [styles.right]: isRight,
    })}
    style={style}
  >
    {isCenter && isEmpty && (
      <div className={classNames(styles.iconContainer)}>
        <Star className={styles.star} />
      </div>
    )}

    {isFiltered && (
      <div className={classNames(styles.iconContainer, styles.flagContainer)}>
        <FlagFill className={styles.flag} />
      </div>
    )}

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
