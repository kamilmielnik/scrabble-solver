import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { applyResult } from 'shared/state';

import { highlightResult, unhighlightResult } from './state';
import styles from './Result.module.scss';

const Result = ({ result, style }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={styles.row}
      style={style}
      onClick={() => dispatch(applyResult(result.id))}
      onMouseEnter={() => dispatch(highlightResult(result.id))}
      onMouseLeave={() => dispatch(unhighlightResult())}
    >
      <div className={classNames(styles.cell, styles.word)}>{result.word}</div>
      <div className={classNames(styles.cell, styles.points)}>{result.points}</div>
    </div>
  );
};

Result.propTypes = {
  result: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default Result;
