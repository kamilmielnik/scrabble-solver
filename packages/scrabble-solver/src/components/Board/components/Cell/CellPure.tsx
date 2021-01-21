import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import React, {
  CSSProperties,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  memo,
  MouseEventHandler,
  RefObject,
} from 'react';

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
  size: number;
  style?: CSSProperties;
  tile: TileModel;
  translate: Translate;
  onDirectionToggleClick: MouseEventHandler<HTMLButtonElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onToggleBlankClick: MouseEventHandler<HTMLButtonElement>;
}

const CellPure: FunctionComponent<Props> = ({
  bonus,
  cell,
  className,
  direction,
  inputRef,
  isEmpty,
  size,
  style,
  tile,
  translate,
  onDirectionToggleClick,
  onFocus,
  onKeyDown,
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
      raised={!isEmpty}
      size={size}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />

    <div className={styles.actions}>
      <Button title={translate('cell.toggle-direction')} onClick={onDirectionToggleClick}>
        <SvgIcon
          className={classNames(styles.toggleDirection, {
            [styles.right]: direction === 'horizontal',
          })}
          icon={arrowDown}
        />
      </Button>

      {!isEmpty && (
        <Button
          className={classNames({
            [styles.blank]: tile.isBlank,
          })}
          title={tile.isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
          onClick={onToggleBlankClick}
        >
          B
        </Button>
      )}
    </div>
  </div>
);

export default memo(CellPure);
