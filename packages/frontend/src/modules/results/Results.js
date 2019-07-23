import React from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';

import Loading from 'components/loading';
import { useIsLoading } from 'shared';

import Header from './Header';
import Result from './Result';
import { useResults } from './hooks';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 39;
const ITEM_HEIGHT = 38;
const getItemSize = () => ITEM_HEIGHT;

const Results = ({ height, width }) => {
  const isLoading = useIsLoading();
  const results = useResults();

  return (
    <Loading isLoading={isLoading}>
      <Header />

      <VariableSizeList
        className={styles.list}
        height={height - HEADER_HEIGHT}
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
