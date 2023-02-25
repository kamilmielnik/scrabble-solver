import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  memo,
  MouseEventHandler,
  RefObject,
} from 'react';

import { ArrowDown, Flag, FlagFill, Square, SquareFill, Star } from 'icons';
import { Translate } from 'types';

import Button from '../../../Button';
import Tile from '../../../Tile';

import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  'aria-label': string;
  bonus: Bonus | undefined;
  cell: Cell;
  className?: string;
  direction: 'horizontal' | 'vertical';
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
  translate: Translate;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onDirectionToggleClick: MouseEventHandler<HTMLButtonElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onToggleBlankClick: MouseEventHandler<HTMLButtonElement>;
  onToggleFilterCellClick: MouseEventHandler<HTMLButtonElement>;
}

const CellPure: FunctionComponent<Props> = ({
  'aria-label': ariaLabel,
  bonus,
  cell,
  className,
  direction,
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
  translate,
  onChange,
  onDirectionToggleClick,
  onFocus,
  onToggleBlankClick,
  onToggleFilterCellClick,
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

    {!cell.isCandidate() && (
      <div className={styles.actions}>
        <Button
          aria-label={translate('cell.toggle-direction')}
          className={styles.action}
          Icon={ArrowDown}
          iconClassName={classNames(styles.toggleDirection, {
            [styles.right]: direction === 'horizontal',
          })}
          tooltip={translate('cell.toggle-direction')}
          onClick={onDirectionToggleClick}
        />

        {isEmpty && (
          <Button
            aria-label={translate('cell.filter-cell')}
            className={classNames(styles.action)}
            Icon={isFiltered ? Flag : FlagFill}
            tooltip={translate('cell.filter-cell')}
            onClick={onToggleFilterCellClick}
          />
        )}

        {!isEmpty && (
          <Button
            aria-label={tile.isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            className={styles.action}
            Icon={tile.isBlank ? SquareFill : Square}
            tooltip={tile.isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={onToggleBlankClick}
          />
        )}
      </div>
    )}
  </div>
);

export default memo(CellPure);
