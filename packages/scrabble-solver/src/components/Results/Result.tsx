import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';

import { board, results as resultsSlice, selectResults, useTypedSelector } from 'state';

import styles from './Results.module.scss';

interface Props {
  index: number;
  style?: CSSProperties;
}

const Result = ({ index, style }: Props) => {
  const dispatch = useDispatch();
  const results = useTypedSelector(selectResults);
  const result = results[index];

  const handleClick = () => {
    dispatch(board.actions.applyResult(result));
  };

  const handleMouseEnter = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleMouseLeave = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  return (
    <div
      className={styles.row}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classNames(styles.cell, styles.word)}>{result.word}</div>
      <div className={classNames(styles.cell, styles.points)}>{result.points}</div>
    </div>
  );
};

export default Result;
