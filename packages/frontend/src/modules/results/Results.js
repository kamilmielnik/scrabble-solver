import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';

import Loading from 'components/loading';
import { useIsLoading } from 'shared';

import Empty from './Empty';
import Header from './Header';
import Result from './Result';
import { useResults } from './hooks';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 39;
const ITEM_HEIGHT = 38;

const Results = ({ height, width }) => {
  const isLoading = useIsLoading();
  const results = useResults();

  return (
    <Loading className={styles.loading} isLoading={isLoading}>
      <div className={styles.results} style={{ width }}>
        <Header />

        {results.length > 0 && (
          <FixedSizeList
            height={height - HEADER_HEIGHT}
            itemCount={results.length}
            itemSize={ITEM_HEIGHT}
            width={width}
          >
            {({ index, style }) => <Result result={results[index]} style={style} />}
          </FixedSizeList>
        )}

        {results.length === 0 && <Empty />}
      </div>
    </Loading>
  );
};

Results.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Results;
