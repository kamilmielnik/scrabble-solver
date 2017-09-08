import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { EMPTY_CELL } from 'scrabble-solver-commons/constants';
import { changeCellValue, toggleCellIsBlank } from 'board/state';
import { submit } from 'tiles/state';
import { selectBonus, selectCharacterPoints } from 'board/selectors';
import { selectConfig } from 'config/selectors';
import Tile from './tile';
import handleKeys from './handle-keys';
import { getBonusClassname, getCharacterPointsClassname } from './cell-classnames';
import styles from './styles.scss';

const Cell = ({ bonus, cell, characterPoints, className, ...tileProps }) => (
  <div
    className={classNames(
      styles.cell,
      getBonusClassname(cell, bonus),
      getCharacterPointsClassname(characterPoints),
      {
        [styles.candidate]: cell.isCandidate(),
        [styles.empty]: cell.isEmpty && !cell.hasTile()
      },
      className
    )}>
    <Tile tile={cell.tile} {...tileProps} />
  </div>
);

Cell.propTypes = {
  bonus: PropTypes.object,
  cell: PropTypes.object.isRequired,
  characterPoints: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired
};

const mapStateToProps = (state, { cell }) => ({
  bonus: selectBonus(state, cell),
  config: selectConfig(state),
  characterPoints: selectCharacterPoints(state, cell)
});

const mapDispatchToProps = (dispatch, { cell: { x, y } }) => ({
  dispatch,
  onChange: (event) => dispatch(changeCellValue(x, y, event.target.value))
});

const mergeProps = ({ config, ...stateProps }, { dispatch, ...dispatchProps }, ownProps) => {
  const { cell: { x, y } } = ownProps;
  const {
    handleArrowKeys,
    isArrowKey,
    isCharacter,
    isRemovingCharacter,
    isSubmitting,
    isTogglingBlank
  } = handleKeys(config);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onKeyDown: (event) => {
      const { key } = event;
      if(isRemovingCharacter(event)) {
        dispatch(changeCellValue(x, y, EMPTY_CELL));
      } else if(isTogglingBlank(event)) {
        dispatch(toggleCellIsBlank(x, y));
      } else if(isArrowKey(event)) {
        handleArrowKeys(event);
      } else if(isCharacter(event)) {
        dispatch(changeCellValue(x, y, key));
      }
    },
    onKeyUp: (event) => {
      if(isSubmitting(event)) {
        dispatch(submit());
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Cell);
