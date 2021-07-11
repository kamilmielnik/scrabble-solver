import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { FixedSizeList } from 'react-window';

import { RESULTS_HEADER_HEIGHT, RESULTS_INPUT_HEIGHT, RESULTS_ITEM_HEIGHT } from 'parameters';
import { selectAreResultsOutdated, selectIsLoading, selectSortedResults, useTranslate, useTypedSelector } from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';
import ResultsInput from '../ResultsInput';

import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';
import SolveButton from './SolveButton';

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const translate = useTranslate();
  const results = useTypedSelector(selectSortedResults);
  const isLoading = useTypedSelector(selectIsLoading);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);

  return (
    <div className={styles.results}>
      <Header />

      {typeof results === 'undefined' && (
        <EmptyState className={styles.emptyState} type="info">
          {translate('results.empty-state.uninitialized')}

          <SolveButton />
        </EmptyState>
      )}

      {typeof results !== 'undefined' && (
        <>
          {isOutdated && (
            <EmptyState className={styles.emptyState} type="info">
              {translate('results.empty-state.outdated')}

              <SolveButton />
            </EmptyState>
          )}

          {!isOutdated && (
            <>
              {results.length > 0 && (
                <FixedSizeList
                  className={classNames(styles.list, {
                    [styles.outdated]: isOutdated,
                  })}
                  height={height - RESULTS_HEADER_HEIGHT - RESULTS_INPUT_HEIGHT}
                  itemCount={results.length}
                  itemSize={RESULTS_ITEM_HEIGHT}
                  width={width}
                >
                  {Result}
                </FixedSizeList>
              )}

              {results.length > 0 && <ResultsInput />}

              {results.length === 0 && (
                <EmptyState className={styles.emptyState} type="warning">
                  {translate('results.empty-state.no-results')}
                </EmptyState>
              )}
            </>
          )}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default Results;
