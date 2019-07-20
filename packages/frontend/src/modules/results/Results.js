import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { VariableSizeList } from 'react-window';

import Loading from 'components/loading';
import { useIsLoading } from 'shared';
import { applyResult } from 'shared/state';

import { useResults } from './hooks';
import { highlightResult, unhighlightResult } from './state';
import styles from './Results.module.scss';

const getItemSize = () => 38;

const Results = ({ height, width }) => {
  const dispatch = useDispatch();
  const isLoading = useIsLoading();
  const results = useResults();

  return (
    <Loading isLoading={isLoading}>
      <VariableSizeList
        className={styles.list}
        height={height}
        itemCount={results.length}
        itemSize={getItemSize}
        width={width}
      >
        {({ index, style }) => {
          const result = results[index];

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
        }}
      </VariableSizeList>
    </Loading>
  );
};

Results.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Results;
