import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';

import { resultsSlice, selectSortedResults, useTypedSelector } from 'state';

import styles from './Results.module.scss';

interface Props {
  index: number;
  style?: CSSProperties;
}

const Result = ({ index, style }: Props) => {
  const dispatch = useDispatch();
  const results = useTypedSelector(selectSortedResults)!;
  const result = results[index];

  const handleClick = () => {
    dispatch(resultsSlice.actions.applyResult(result));
  };

  const handleMouseEnter = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleMouseLeave = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  return (
    <button
      className={styles.result}
      style={style}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.resultContent}>
        <span className={classNames(styles.cell, styles.word)}>{result.word}</span>
        <span className={classNames(styles.cell, styles.points)}>{result.points}</span>
      </span>
    </button>
  );
};

export default Result;
