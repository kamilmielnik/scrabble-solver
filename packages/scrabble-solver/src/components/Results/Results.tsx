import classNames from 'classnames';
import { useEffect, useMemo, type FunctionComponent } from 'react';
import { List, useListRef } from 'react-window';
import { useDebounce } from 'use-debounce';

import { useLatest } from '@/hooks/useLatest';
import { LOCALE_FEATURES } from '@/i18n/constants';
import { RESULTS_ITEM_HEIGHT, RESULTS_OVERSCAN_COUNT } from '@/parameters';
import {
  selectAreResultsOutdated,
  selectLocale,
  selectProcessedResults,
  selectSolveError,
  selectSolveIsLoading,
  useTranslate,
  useTypedSelector,
} from '@/state';

import { EmptyState } from '../EmptyState';
import { Loading } from '../Loading';
import { ResultsInput } from '../ResultsInput';

import { Header } from './Header';
import { Result } from './Result';
import styles from './Results.module.scss';
import { SolveButton } from './SolveButton';
import { type ResultCallbacks, type ResultData } from './types';

interface Props {
  callbacks: ResultCallbacks;
  className?: string;
  highlightedIndex?: number;
}

const IS_LOADING_DEBOUNCE = 100;

export const Results: FunctionComponent<Props> = ({ callbacks, className, highlightedIndex }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const results = useTypedSelector(selectProcessedResults);
  const isLoading = useTypedSelector(selectSolveIsLoading);
  const [isLoadingDebounced] = useDebounce(isLoading, IS_LOADING_DEBOUNCE);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const error = useTypedSelector(selectSolveError);
  const itemData = useMemo<ResultData>(
    () => ({
      highlightedIndex,
      results,
      onBlur: callbacks.onBlur,
      onClick: callbacks.onClick,
      onFocus: callbacks.onFocus,
      onMouseEnter: callbacks.onMouseEnter,
    }),
    [callbacks, highlightedIndex, results],
  );
  const listRef = useListRef(null);
  const scrollToIndex = typeof highlightedIndex === 'number' ? highlightedIndex : 0;
  const scrollToIndexRef = useLatest(scrollToIndex);
  const hasResults = typeof error === 'undefined' && typeof results !== 'undefined';
  const showInput = hasResults && results.length > 0 && !isOutdated;

  useEffect(() => {
    // without setTimeout, the initial scrolling offset is calculated
    // incorrectly, as the list is not fully rendered by the browser yet
    const timeout = globalThis.setTimeout(() => {
      listRef.current?.scrollToRow({
        align: 'center',
        behavior: 'instant',
        index: scrollToIndexRef.current,
      });
    }, 0);

    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [results, listRef, scrollToIndexRef]);

  return (
    <div
      aria-busy={isLoadingDebounced}
      aria-label={translate('results')}
      className={classNames(styles.results, className)}
      data-outdated={isOutdated}
      data-testid="results"
      role="region"
    >
      <Header />

      <div aria-live="polite" className={styles.content}>
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
              <div className={styles.listContainer} onMouseLeave={callbacks.onMouseLeave}>
                <List
                  className={classNames(styles.list, {
                    [styles.outdated]: isOutdated,
                  })}
                  dir={direction}
                  listRef={listRef}
                  overscanCount={RESULTS_OVERSCAN_COUNT}
                  rowComponent={Result}
                  rowCount={results.length}
                  rowHeight={RESULTS_ITEM_HEIGHT}
                  rowProps={itemData}
                />
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
