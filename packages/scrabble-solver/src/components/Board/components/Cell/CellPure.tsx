import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, FunctionComponent, memo, MouseEventHandler, RefObject } from 'react';

import { ArrowDown, Flag } from 'icons';
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
    {isFiltered && (
      <div className={styles.flagContainer}>
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
      onFocus={onFocus}
    />

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
  </div>
);

export default memo(CellPure);
