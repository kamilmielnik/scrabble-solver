import React, { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';

import { selectIsLoading, selectSortedResults, useTypedSelector } from 'state';

import Loading from '../Loading';

import Empty from './Empty';
import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 32;
const ITEM_HEIGHT = 38;

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const results = useTypedSelector(selectSortedResults);
  const isLoading = useTypedSelector(selectIsLoading);

  return (
    <div className={styles.results} style={{ width }}>
      <Header />

      {results.length > 0 && (
        <FixedSizeList height={height - HEADER_HEIGHT} itemCount={results.length} itemSize={ITEM_HEIGHT} width={width}>
          {Result}
        </FixedSizeList>
      )}

      {results.length === 0 && <Empty />}

      {isLoading && <Loading className={styles.loading} />}
    </div>
  );
};

export default Results;
