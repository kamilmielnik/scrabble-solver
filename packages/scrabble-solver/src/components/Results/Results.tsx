import React, { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';

import { selectResults, useTypedSelector } from 'state';

import Empty from './Empty';
import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 39;
const ITEM_HEIGHT = 38;

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const results = useTypedSelector(selectResults);

  return (
    <div className={styles.results} style={{ width }}>
      <Header />

      {results.length > 0 && (
        <FixedSizeList height={height - HEADER_HEIGHT} itemCount={results.length} itemSize={ITEM_HEIGHT} width={width}>
          {Result}
        </FixedSizeList>
      )}

      {results.length === 0 && <Empty />}
    </div>
  );
};

export default Results;
