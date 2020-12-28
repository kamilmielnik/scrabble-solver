import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/models';
import classNames from 'classnames';
import React, { forwardRef, KeyboardEventHandler, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Tile } from 'components';
import { createKeyboardNavigation } from 'lib';
import { board, selectBonus, selectCharacterPoints, selectConfig, solve, useTypedSelector } from 'state';

import styles from './Cell.module.scss';
import { getBonusClassname, getCharacterPointsClassname } from './lib';

interface Props {
  cell: CellModel;
  className?: string;
  onFocus: (x: number, y: number) => void;
  onKeyDown: KeyboardEventHandler;
  onMoveFocus: () => void;
}

interface Ref {
  focus: () => void;
}

const Cell = forwardRef<Ref, Props>(({ cell, className, onFocus, onKeyDown, onMoveFocus }, ref) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const bonus = useTypedSelector((state) => selectBonus(state, cell));
  const characterPoints = useTypedSelector((state) => selectCharacterPoints(state, cell));
  const handleFocus = useCallback(() => onFocus(cell.x, cell.y), [cell.x, cell.y, onFocus]);
  const handleKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onDelete: () => dispatch(board.actions.changeCellValue({ value: EMPTY_CELL, x: cell.x, y: cell.y })),
        onBackspace: () => dispatch(board.actions.changeCellValue({ value: EMPTY_CELL, x: cell.x, y: cell.y })),
        onEnter: () => dispatch(solve.actions.submit()),
        onKeyDown: (event) => {
          const character = event.key;
          const isTogglingBlank = (event.ctrlKey || event.metaKey) && character === 'b';

          if (isTogglingBlank) {
            dispatch(board.actions.toggleCellIsBlank({ x: cell.x, y: cell.y }));
          } else if (config.hasCharacter(character)) {
            dispatch(board.actions.changeCellValue({ value: character, x: cell.x, y: cell.y }));
            onMoveFocus();
          }

          onKeyDown(event);
        },
      }),
    [cell.x, cell.y, config, dispatch, onKeyDown, onMoveFocus],
  );

  return (
    <div
      className={classNames(
        styles.cell,
        getBonusClassname(cell, bonus),
        getCharacterPointsClassname(characterPoints),
        className,
        {
          [styles.candidate]: cell.isCandidate(),
          [styles.empty]: cell.isEmpty && !cell.hasTile(),
        },
      )}
    >
      <Tile
        character={cell.tile.character === EMPTY_CELL ? null : cell.tile.character}
        highlighted={cell.isCandidate()}
        isBlank={cell.tile.isBlank}
        raised={cell.tile.character !== EMPTY_CELL}
        ref={ref}
        small
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});

export default Cell;
