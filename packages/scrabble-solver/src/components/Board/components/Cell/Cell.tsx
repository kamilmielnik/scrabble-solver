import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/models';
import classNames from 'classnames';
import React, { FunctionComponent, KeyboardEventHandler, memo, RefObject, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation } from 'lib';
import { boardSlice, selectBonus, selectConfig, solveSlice, useTypedSelector } from 'state';

import Tile from '../../../Tile';

import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef?: RefObject<HTMLInputElement>;
  size: number;
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
  onFocus,
  onKeyDown,
  onMoveFocus,
}) => {
  const { tile, x, y } = cell;
  const dispatch = useDispatch();
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

      <div
        className={classNames(styles.direction, {
          [styles.right]: direction === 'horizontal',
        })}
      />
    </div>
  );
};

export default memo(Cell);
