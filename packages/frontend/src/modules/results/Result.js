import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useApplyResult, useHighlightResult, useResults, useUnhighlightResult } from './hooks';
import styles from './Results.module.scss';

const Result = ({ index, style }) => {
  const results = useResults();
  const result = results[index];
  const applyResult = useApplyResult(result.id);
  const highlightResult = useHighlightResult(result.id);
  const unhighlightResult = useUnhighlightResult();
  return (
    <div
      className={styles.row}
      style={style}
      onClick={applyResult}
      onMouseEnter={highlightResult}
      onMouseLeave={unhighlightResult}
    >
      <div className={classNames(styles.cell, styles.word)}>{result.word}</div>
      <div className={classNames(styles.cell, styles.points)}>{result.points}</div>
    </div>
  );
};

Result.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default Result;
