import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { EMPTY_CELL } from '@scrabble-solver/constants';

import { submit } from 'tiles';
import { useConfig } from 'config';
import { Tile } from 'components';
import { createKeyboardNavigation } from 'utils';

import handleKeys from './handle-keys';
import { useBonus, useCharacterPoints } from './hooks';
import { getBonusClassname, getCharacterPointsClassname } from './cell-classnames';
import { changeCellValue, toggleCellIsBlank } from './state';
import styles from './Cell.module.scss';

const Cell = ({ cell, className /*, onKeyDown*/ }) => {
  const dispatch = useDispatch();
  const config = useConfig();
  const bonus = useBonus(cell);
  const characterPoints = useCharacterPoints(cell);
  const { x, y } = cell;

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
        className=""
        highlighted={cell.isCandidate()}
        isBlank={cell.tile.isBlank}
        small
        onKeyDown={createKeyboardNavigation({
          onDelete: () => dispatch(changeCellValue(x, y, EMPTY_CELL)),
          onBackspace: () => dispatch(changeCellValue(x, y, EMPTY_CELL)),
          onEnter: () => dispatch(submit()),
          onKeyDown: (event) => {
            const character = event.key;
            const isTogglingBlank = (event.ctrlKey || event.metaKey) && character === 'b';

            if (isTogglingBlank) {
              dispatch(toggleCellIsBlank(x, y));
            } else if (config.hasCharacter(character)) {
              dispatch(changeCellValue(x, y, character));
            }

            // onKeyDown(event)
          }
        })}
      />
    </div>
  );
};

Cell.propTypes = {
  cell: PropTypes.object.isRequired,
  className: PropTypes.string,
  onKeyDown: PropTypes.func.isRequired
};

export default Cell;
