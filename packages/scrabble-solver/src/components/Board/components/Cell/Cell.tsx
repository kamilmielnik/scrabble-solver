import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/models';
import classNames from 'classnames';
import React, { FunctionComponent, KeyboardEventHandler, memo, RefObject, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { move } from 'icons';
import { createKeyboardNavigation } from 'lib';
import { boardSlice, selectBonus, selectConfig, solveSlice, useTranslate, useTypedSelector } from 'state';

import SvgIcon from '../../../SvgIcon';
import Tile from '../../../Tile';

import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef?: RefObject<HTMLInputElement>;
  size: number;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler;
  onMoveFocus: () => void;
}

const Cell: FunctionComponent<Props> = ({
  cell,
  className,
  direction,
  inputRef,
  size,
  onDirectionToggle,
  onFocus,
  onKeyDown,
  onMoveFocus,
}) => {
  const { tile, x, y } = cell;
  const dispatch = useDispatch();
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const bonus = useTypedSelector((state) => selectBonus(state, cell));
  const handleFocus = useCallback(() => onFocus(x, y), [x, y, onFocus]);
  const handleKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onDelete: () => dispatch(boardSlice.actions.changeCellValue({ value: EMPTY_CELL, x, y })),
        onBackspace: () => dispatch(boardSlice.actions.changeCellValue({ value: EMPTY_CELL, x, y })),
        onEnter: () => dispatch(solveSlice.actions.submit()),
        onKeyDown: (event) => {
          const character = event.key.toLowerCase();
          const isTogglingBlank = (event.ctrlKey || event.metaKey) && character === 'b';

          if (isTogglingBlank) {
            dispatch(boardSlice.actions.toggleCellIsBlank({ x, y }));
          } else if (config.hasCharacter(character)) {
            dispatch(boardSlice.actions.changeCellValue({ value: character, x, y }));
            onMoveFocus();
          }

          onKeyDown(event);
        },
      }),
    [x, y, config, dispatch, onKeyDown, onMoveFocus],
  );
  const { tileFontSize } = Tile.getSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const isLastColumn = x === config.boardWidth - 1;
  const isLastRow = y === config.boardHeight - 1;
  const showDirection = (direction === 'horizontal' && !isLastColumn) || (direction === 'vertical' && !isLastRow);

  const handleDirectionToggleClick = useCallback(() => {
    onDirectionToggle();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onDirectionToggle]);

  return (
    <div
      className={classNames(styles.cell, getBonusClassname(cell, bonus), className, {
        [styles.candidate]: cell.isCandidate(),
      })}
      style={{
        fontSize: tileFontSize,
      }}
    >
      <Tile
        className={styles.tile}
        character={isEmpty ? undefined : tile.character}
        highlighted={cell.isCandidate()}
        inputRef={inputRef}
        isBlank={tile.isBlank}
        raised={!isEmpty}
        size={size}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      {showDirection && (
        <div
          className={classNames(styles.direction, {
            [styles.right]: direction === 'horizontal',
          })}
        />
      )}

      <button
        className={classNames(styles.toggleDirection, {
          [styles.right]: direction === 'horizontal',
        })}
        title={translate('cell.toggle-direction')}
        type="button"
        onClick={handleDirectionToggleClick}
      >
        <SvgIcon className={styles.icon} icon={move} />
      </button>
    </div>
  );
};

export default memo(Cell);
