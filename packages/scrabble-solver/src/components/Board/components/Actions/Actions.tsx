import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import { forwardRef, HTMLProps, MouseEventHandler } from 'react';

import { Ban, Cross, FlagFill, Keyboard, Square, SquareFill } from 'icons';
import { findCell } from 'lib';
import { selectCellFilter, selectInputMode, selectResultCandidateCells, useTranslate, useTypedSelector } from 'state';
import { CellFilterEntry, Direction } from 'types';

import Button from '../../../Button';
import ToggleDirectionButton from '../ToggleDirectionButton';

import styles from './Actions.module.scss';

interface Props extends HTMLProps<HTMLDivElement> {
  cell: Cell;
  direction: Direction;
  onDirectionToggle: MouseEventHandler<HTMLButtonElement>;
  onEnterWord: MouseEventHandler<HTMLButtonElement>;
  onToggleBlank: MouseEventHandler<HTMLButtonElement>;
  onToggleFilterCell: MouseEventHandler<HTMLButtonElement>;
}

const Actions = forwardRef<HTMLDivElement, Props>(
  (
    { cell, className, direction, onDirectionToggle, onEnterWord, onToggleBlank, onToggleFilterCell, ...props },
    ref,
  ) => {
    const translate = useTranslate();
    const inputMode = useTypedSelector(selectInputMode);
    const filter = useTypedSelector((state) => selectCellFilter(state, cell));
    const resultCandidateCells = useTypedSelector(selectResultCandidateCells);
    const isBlank = cell.tile.isBlank;
    const isEmpty = cell.tile.character === EMPTY_CELL || Boolean(findCell(resultCandidateCells, cell.x, cell.y));

    // On iOS it helps with losing focus too early which makes Actions disappear
    const handleMouseDown: MouseEventHandler = (event) => event.preventDefault();

    return (
      <div className={classNames(styles.actions, className)} ref={ref} {...props}>
        {inputMode === 'touchscreen' && (
          <Button
            aria-label={translate('cell.enter-word')}
            className={styles.action}
            Icon={Keyboard}
            tooltip={translate('cell.enter-word')}
            onClick={onEnterWord}
            onMouseDown={handleMouseDown}
          />
        )}

        {inputMode === 'keyboard' && (
          <ToggleDirectionButton
            className={styles.action}
            direction={direction}
            onClick={onDirectionToggle}
            onMouseDown={handleMouseDown}
          />
        )}

        {isEmpty && (
          <Button
            aria-label={translate('cell.filter-cell')}
            className={classNames(styles.action)}
            Icon={getNextFilterIcon(filter)}
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
            tooltip={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            onClick={onToggleBlank}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    );
  },
);

const getNextFilterIcon = (filter: CellFilterEntry | undefined) => {
  if (filter?.type === 'exclude') {
    return Cross;
  }

  if (filter?.type === 'include') {
    return Ban;
  }

  return FlagFill;
};

export default Actions;
