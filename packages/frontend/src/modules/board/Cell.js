import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, useDispatch } from 'react-redux';
import { EMPTY_CELL } from '@scrabble-solver/constants';

import { submit } from 'tiles';
import { selectConfig } from 'config';
import { Tile } from 'components';

import handleKeys from './handle-keys';
import { useBonus, useCharacterPoints } from './hooks';
import { getBonusClassname, getCharacterPointsClassname } from './cell-classnames';
import { changeCellValue, toggleCellIsBlank } from './state';
import styles from './Cell.module.scss';

const Cell = ({ cell, className, onKeyDown }) => {
  const dispatch = useDispatch();
  const bonus = useBonus(cell);
  const characterPoints = useCharacterPoints(cell);

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
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

Cell.propTypes = {
  cell: PropTypes.object.isRequired,
  className: PropTypes.string,
  onKeyDown: PropTypes.func.isRequired
};

const mapStateToProps = (state, { cell }) => ({
  config: selectConfig(state)
});

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

const mergeProps = ({ config, ...stateProps }, { dispatch }, ownProps) => {
  const {
    cell: { x, y }
  } = ownProps;
  const { handleArrowKeys, isArrowKey, isCharacter, isRemovingCharacter, isSubmitting, isTogglingBlank } = handleKeys(
    config
  );

  return {
    ...stateProps,
    ...ownProps,
    onKeyDown: (event) => {
      const { key } = event;
      if (isRemovingCharacter(event)) {
        dispatch(changeCellValue(x, y, EMPTY_CELL));
      } else if (isTogglingBlank(event)) {
        dispatch(toggleCellIsBlank(x, y));
      } else if (isArrowKey(event)) {
        handleArrowKeys(event);
      } else if (isCharacter(event)) {
        dispatch(changeCellValue(x, y, key));
      } else if (isSubmitting(event)) {
        dispatch(submit());
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Cell);
