import React, { forwardRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { EMPTY_CELL } from '@scrabble-solver/constants';

import { submit } from 'tiles';
import { useConfig } from 'config';
import { Tile } from 'components';
import { createKeyboardNavigation } from 'utils';

import { useBonus, useCharacterPoints } from './hooks';
import { getBonusClassname, getCharacterPointsClassname } from './cell-classnames';
import { changeCellValue, toggleCellIsBlank } from './state';
import styles from './Cell.module.scss';

const Cell = forwardRef(({ cell, className, onFocus, onKeyDown, onMoveFocus }, ref) => {
  const dispatch = useDispatch();
  const config = useConfig();
  const bonus = useBonus(cell);
  const characterPoints = useCharacterPoints(cell);
  const handleFocus = useCallback(() => onFocus(cell.x, cell.y), [cell.x, cell.y, onFocus]);
  const handleKeyDown = useMemo(
    () =>
      createKeyboardNavigation({
        onDelete: () => dispatch(changeCellValue(cell.x, cell.y, EMPTY_CELL)),
        onBackspace: () => dispatch(changeCellValue(cell.x, cell.y, EMPTY_CELL)),
        onEnter: () => dispatch(submit()),
        onKeyDown: (event) => {
          const character = event.key;
          const isTogglingBlank = (event.ctrlKey || event.metaKey) && character === 'b';

          if (isTogglingBlank) {
            dispatch(toggleCellIsBlank(cell.x, cell.y));
          } else if (config.hasCharacter(character)) {
            dispatch(changeCellValue(cell.x, cell.y, character));
            onMoveFocus();
          }

          onKeyDown(event);
        }
      }),
    [cell.x, cell.y, config, dispatch, onKeyDown]
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
          [styles.empty]: cell.isEmpty && !cell.hasTile()
        }
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

Cell.propTypes = {
  cell: PropTypes.object.isRequired,
  className: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onMoveFocus: PropTypes.func.isRequired
};

export default Cell;
