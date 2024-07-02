import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell } from '@scrabble-solver/types';
import classNames from 'classnames';
import { forwardRef, HTMLProps, MouseEventHandler } from 'react';

import { useIsTouchDevice } from 'hooks';
import { Keyboard, Square, SquareFill } from 'icons';
import { findCell, isMac } from 'lib';
import { selectCellFilter, selectInputMode, selectResultCandidateCells, useTranslate, useTypedSelector } from 'state';
import { Direction } from 'types';

import Button from '../../../Button';
import ToggleDirectionButton from '../ToggleDirectionButton';

import styles from './Actions.module.scss';
import { getNextCellFilter } from './lib';

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
    const isTouchDevice = useIsTouchDevice();
    const inputMode = useTypedSelector(selectInputMode);
    const filter = useTypedSelector((state) => selectCellFilter(state, cell));
    const resultCandidateCells = useTypedSelector(selectResultCandidateCells);
    const isBlank = cell.tile.isBlank;
    const isEmpty = cell.tile.character === EMPTY_CELL || Boolean(findCell(resultCandidateCells, cell.x, cell.y));
    const { Icon, labelTranslationKey } = getNextCellFilter(filter);

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
            aria-label={translate(labelTranslationKey)}
            className={classNames(styles.action)}
            Icon={Icon}
            tooltip={
              <>
                <span>{translate(labelTranslationKey)}</span>
                {!isTouchDevice && <span> ({isMac() ? '⌘' : 'Ctrl'} + G)</span>}
              </>
            }
            onClick={onToggleFilterCell}
            onMouseDown={handleMouseDown}
          />
        )}

        {!isEmpty && (
          <Button
            aria-label={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
            className={styles.action}
            Icon={isBlank ? SquareFill : Square}
            tooltip={
              <>
                <span>{isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}</span>
                {!isTouchDevice && <span> ({translate('common.space')})</span>}
              </>
            }
            onClick={onToggleBlank}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    );
  },
);

export default Actions;
