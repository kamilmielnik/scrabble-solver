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
  ({ cell, className, direction, disabled, onDirectionToggle, onToggleBlank, onToggleFilterCell, ...props }, ref) => {
    const translate = useTranslate();
    const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
    const isBlank = cell.tile.isBlank;
    const isEmpty = cell.tile.character === EMPTY_CELL;

    // On iOS it helps with losing focus too early which makes Actions disappear
    const handleMouseDown: MouseEventHandler = (event) => event.preventDefault();

    return (
      <div className={classNames(styles.actions, className)} ref={ref} {...props}>
        <Button
          aria-label={translate('cell.toggle-direction')}
          className={styles.action}
          Icon={ArrowDown}
          iconClassName={classNames(styles.toggleDirection, {
            [styles.right]: direction === 'horizontal',
          })}
          tabIndex={disabled ? -1 : undefined}
          tooltip={translate('cell.toggle-direction')}
          onClick={onDirectionToggle}
          onMouseDown={handleMouseDown}
        />

        {isEmpty && (
          <Button
            aria-label={translate('cell.filter-cell')}
            className={classNames(styles.action)}
            Icon={isFiltered ? Flag : FlagFill}
            tabIndex={disabled ? -1 : undefined}
            tooltip={translate('cell.filter-cell')}
            onClick={onToggleFilterCell}
            onMouseDown={handleMouseDown}
          />
        )}

        {!isEmpty && (
          <Button
            aria-label={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            className={styles.action}
            Icon={isBlank ? SquareFill : Square}
            tabIndex={disabled ? -1 : undefined}
            tooltip={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={onToggleBlank}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    );
  },
);

export default Actions;
