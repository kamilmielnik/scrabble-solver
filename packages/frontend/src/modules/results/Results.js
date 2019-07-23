import React from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';

import Loading from 'components/loading';
import { useIsLoading } from 'shared';

import Result from './Result';
import { useResults } from './hooks';
import styles from './Results.module.scss';

const getItemSize = () => 38;

const Results = ({ height, width }) => {
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
        {({ index, style }) => <Result result={results[index]} style={style} />}
      </VariableSizeList>
    </Loading>
  );
};

Results.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Results;
