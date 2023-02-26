import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import { forwardRef, HTMLProps, MouseEventHandler } from 'react';

import { ArrowDown, Flag, FlagFill, Square, SquareFill } from 'icons';
import { selectCellIsFiltered, useTranslate, useTypedSelector } from 'state';

import Button from '../../../Button';

import styles from './Actions.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  cell: Cell;
  direction: 'horizontal' | 'vertical';
  onDirectionToggle: MouseEventHandler<HTMLButtonElement>;
  onToggleBlank: MouseEventHandler<HTMLButtonElement>;
  onToggleFilterCell: MouseEventHandler<HTMLButtonElement>;
}

const Actions = forwardRef<HTMLDivElement, Props>(
  ({ cell, className, direction, onDirectionToggle, onToggleBlank, onToggleFilterCell, ...props }, ref) => {
    const translate = useTranslate();
    const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
    const isBlank = cell.tile.isBlank;
    const isEmpty = cell.tile.character === EMPTY_CELL;

    return (
      <div className={classNames(styles.actions, className)} ref={ref} {...props}>
        <Button
          aria-label={translate('cell.toggle-direction')}
          className={styles.action}
          Icon={ArrowDown}
          iconClassName={classNames(styles.toggleDirection, {
            [styles.right]: direction === 'horizontal',
          })}
          tooltip={translate('cell.toggle-direction')}
          onClick={onDirectionToggle}
        />

        {isEmpty && (
          <Button
            aria-label={translate('cell.filter-cell')}
            className={classNames(styles.action)}
            Icon={isFiltered ? Flag : FlagFill}
            tooltip={translate('cell.filter-cell')}
            onClick={onToggleFilterCell}
          />
        )}

        {!isEmpty && (
          <Button
            aria-label={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            className={styles.action}
            Icon={isBlank ? SquareFill : Square}
            tooltip={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={onToggleBlank}
          />
        )}
      </div>
    );
  },
);

export default Actions;
