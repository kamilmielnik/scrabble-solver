import React, { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';

import { selectIsLoading, selectSortedResults, useTranslate, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';

import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 35;
const ITEM_HEIGHT = 34;

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const translate = useTranslate();
  const results = useTypedSelector(selectSortedResults);
  const isLoading = useTypedSelector(selectIsLoading);

  return (
    <div className={styles.results}>
      <Header />

      {typeof results === 'undefined' && (
        <EmptyState type="info">{translate('results.empty-state.unitialized')}</EmptyState>
      )}

      {typeof results !== 'undefined' && (
        <>
          {results.length > 0 && (
            <FixedSizeList
              height={height - HEADER_HEIGHT}
              itemCount={results.length}
              itemSize={ITEM_HEIGHT}
              width={width}
            >
              {Result}
            </FixedSizeList>
          )}

          {results.length === 0 && (
            <EmptyState type="warning">{translate('results.empty-state.no-results')}</EmptyState>
          )}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default Results;
