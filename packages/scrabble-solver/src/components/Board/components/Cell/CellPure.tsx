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

import { ArrowDown, Flag, Star } from 'icons';
import { Translate } from 'types';

import Tile from '../../../Tile';

import Button from './Button';
import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  bonus: Bonus | undefined;
  cell: Cell;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef: RefObject<HTMLInputElement>;
  isCenter: boolean;
  isEmpty: boolean;
  isFiltered: boolean;
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
  bonus,
  cell,
  className,
  direction,
  inputRef,
  isCenter,
  isEmpty,
  isFiltered,
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
    className={classNames(styles.cell, getBonusClassname(cell, bonus, isCenter), className, {
      [styles.candidate]: cell.isCandidate(),
    })}
    style={style}
  >
    {isCenter && (
      <div className={classNames(styles.iconContainer)}>
        <Star className={styles.star} />
      </div>
    )}

    {isFiltered && (
      <div className={classNames(styles.iconContainer, styles.flagContainer)}>
        <Flag className={styles.flag} />
      </div>
    )}

    <Tile
      className={styles.tile}
      character={isEmpty ? undefined : tile.character}
      highlighted={cell.isCandidate()}
      inputRef={inputRef}
      isBlank={tile.isBlank}
      points={points}
      raised={!isEmpty}
      size={size}
      tabIndex={cell.x === 0 && cell.y === 0 ? undefined : -1}
      onChange={onChange}
      onFocus={onFocus}
    />

    {!cell.isCandidate() && (
      <div className={styles.actions}>
        <Button tooltip={translate('cell.toggle-direction')} onClick={onDirectionToggleClick}>
          <ArrowDown
            className={classNames(styles.toggleDirection, {
              [styles.right]: direction === 'horizontal',
            })}
          />
        </Button>

        {isEmpty && (
          <Button
            className={classNames(styles.filterCell, {
              [styles.filtered]: isFiltered,
            })}
            tooltip={translate('cell.filter-cell')}
            onClick={onToggleFilterCellClick}
          >
            <Flag />
          </Button>
        )}

        {!isEmpty && (
          <Button
            className={classNames(styles.blank, {
              [styles.active]: tile.isBlank,
            })}
            tooltip={tile.isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={onToggleBlankClick}
          >
            B
          </Button>
        )}
      </div>
    )}
  </div>
);

export default memo(CellPure);
