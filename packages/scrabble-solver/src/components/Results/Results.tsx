import classNames from 'classnames';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { useDebounce } from 'use-debounce';

import { useAppLayout, useLatest } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { BORDER_WIDTH, RESULTS_HEADER_HEIGHT, RESULTS_ITEM_HEIGHT, TEXT_INPUT_HEIGHT } from 'parameters';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectLocale,
  selectResults,
  selectSolveError,
  useTranslate,
  useTypedSelector,
} from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';
import ResultsInput from '../ResultsInput';

import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';
import SolveButton from './SolveButton';
import { ResultCallbacks, ResultData } from './types';

interface Props {
  callbacks: ResultCallbacks;
  className?: string;
  highlightedIndex?: number;
}

const IS_LOADING_DEBOUNCE = 100;

const Results: FunctionComponent<Props> = ({ callbacks, className, highlightedIndex }) => {
  const translate = useTranslate();
  const { resultsHeight, resultsWidth } = useAppLayout();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const results = useTypedSelector(selectResults);
  const isLoading = useTypedSelector(selectIsLoading);
  const [isLoadingDebounced] = useDebounce(isLoading, IS_LOADING_DEBOUNCE);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const error = useTypedSelector(selectSolveError);
  const itemData = useMemo(() => ({ ...callbacks, highlightedIndex, results }), [callbacks, highlightedIndex, results]);
  const [listRef, setListRef] = useState<FixedSizeList<ResultData> | null>(null);
  const scrollToIndex = typeof highlightedIndex === 'number' ? highlightedIndex : 0;
  const scrollToIndexRef = useLatest(scrollToIndex);
  const hasResults = typeof error === 'undefined' && typeof results !== 'undefined';
  const showInput = hasResults && results.length > 0 && !isOutdated;
  const height = resultsHeight - RESULTS_HEADER_HEIGHT - (showInput ? TEXT_INPUT_HEIGHT : 0) - 2 * BORDER_WIDTH;
  const width = resultsWidth - 2 * BORDER_WIDTH;

  useEffect(() => {
    // without setTimeout, the initial scrolling offset is calculated
    // incorrectly, as the list is not fully rendered by the browser yet
    const timeout = globalThis.setTimeout(() => {
      if (listRef) {
        listRef.scrollToItem(scrollToIndexRef.current, 'center');
      }
    }, 0);

    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [results, listRef, scrollToIndexRef]);

  return (
    <div className={classNames(styles.results, className)} data-testid="results">
      <Header />

      <div className={styles.content}>
        {typeof error !== 'undefined' && (
          <EmptyState className={styles.emptyState} variant="error">
            {error.message}
          </EmptyState>
        )}

        {typeof error === 'undefined' && typeof results === 'undefined' && (
          <EmptyState className={styles.emptyState} variant="info">
            {translate('results.empty-state.uninitialized')}

            <SolveButton className={styles.solveButton} />
          </EmptyState>
        )}

        {hasResults && (
          <>
            {isOutdated && (
              <EmptyState className={styles.emptyState} variant="info">
                {translate('results.empty-state.outdated')}

                <SolveButton className={styles.solveButton} />
              </EmptyState>
            )}

            {!isOutdated && results.length === 0 && (
              <EmptyState className={styles.emptyState} variant="warning">
                {translate('results.empty-state.no-results')}
              </EmptyState>
            )}

            {!isOutdated && results.length > 0 && (
              <div className={styles.listContainer}>
                <FixedSizeList
                  className={classNames(styles.list, {
                    [styles.outdated]: isOutdated,
                  })}
                  direction={direction}
                  height={height}
                  itemCount={results.length}
                  itemData={itemData}
                  itemSize={RESULTS_ITEM_HEIGHT}
                  ref={setListRef}
                  width={width}
                >
                  {Result}
                </FixedSizeList>
              </div>
            )}
          </>
        )}
      </div>

      {showInput && <ResultsInput className={styles.input} />}

      {isLoadingDebounced && <Loading />}
    </div>
  );
};

export default Results;
