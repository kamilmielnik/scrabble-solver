import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import React, { CSSProperties, FocusEventHandler, FunctionComponent, memo, MouseEventHandler, RefObject } from 'react';

import { arrowDown } from 'icons';
import { Translate } from 'types';

import SvgIcon from '../../../SvgIcon';
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
  isEmpty: boolean;
  points?: number;
  size: number;
  style?: CSSProperties;
  tile: TileModel;
  translate: Translate;
  onDirectionToggleClick: MouseEventHandler<HTMLButtonElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onToggleBlankClick: MouseEventHandler<HTMLButtonElement>;
}

const CellPure: FunctionComponent<Props> = ({
  bonus,
  cell,
  className,
  direction,
  inputRef,
  isEmpty,
  points,
  size,
  style,
  tile,
  translate,
  onDirectionToggleClick,
  onFocus,
  onToggleBlankClick,
}) => (
  <div
    className={classNames(styles.cell, getBonusClassname(cell, bonus), className, {
      [styles.candidate]: cell.isCandidate(),
    })}
    style={style}
  >
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
        <SvgIcon
          className={classNames(styles.toggleDirection, {
            [styles.right]: direction === 'horizontal',
          })}
          icon={arrowDown}
        />
      </Button>

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
