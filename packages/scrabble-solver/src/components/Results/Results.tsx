import classNames from 'classnames';
import { useEffect, useMemo, type FunctionComponent } from 'react';
import { List, useListRef } from 'react-window';
import { useDebounce } from 'use-debounce';

import { useLatest } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { RESULTS_ITEM_HEIGHT } from 'parameters';
import {
  selectAreResultsOutdated,
  selectLocale,
  selectProcessedResults,
  selectResultsDisplayMode,
  selectSolveError,
  selectSolveIsLoading,
  useTranslate,
  useTypedSelector,
} from 'state';

import { EmptyState } from '../EmptyState';
import { Loading } from '../Loading';
import { ResultsInput } from '../ResultsInput';

import { Header } from './Header';
import { ModeButtons } from './ModeButtons';
import { Result } from './Result';
import styles from './Results.module.scss';
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
  const displayMode = useTypedSelector(selectResultsDisplayMode);
  const isLoading = useTypedSelector(selectSolveIsLoading);
  const [isLoadingDebounced] = useDebounce(isLoading, IS_LOADING_DEBOUNCE);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const error = useTypedSelector(selectSolveError);
  const itemData = useMemo<ResultData>(
    () => ({ ...callbacks, highlightedIndex, results }),
    [callbacks, highlightedIndex, results],
  );
  const listRef = useListRef(null);
  const scrollToIndex = typeof highlightedIndex === 'number' ? highlightedIndex : 0;
  const scrollToIndexRef = useLatest(scrollToIndex);
  const hasResults = typeof error === 'undefined' && typeof results !== 'undefined';
  const isHintMode = displayMode !== 'normal';
  const showInput = hasResults && results.length > 0 && !isOutdated && !isHintMode;
  const hintMessageKey = displayMode === 'shortHint' ? 'results.hint.short' : 'results.hint.long';

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
    <div className={classNames(styles.results, className)} data-testid="results">
      <Header />

      <ModeButtons className={styles.modeButtons} />

      <div className={styles.content}>
        {typeof error !== 'undefined' && (
          <EmptyState className={styles.emptyState} variant="error">
            {error.message}
          </EmptyState>
        )}

        {typeof error === 'undefined' && typeof results === 'undefined' && (
          <EmptyState className={styles.emptyState} variant="info">
            {translate('results.empty-state.uninitialized')}
          </EmptyState>
        )}

        {hasResults && (
          <>
            {isOutdated && (
              <EmptyState className={styles.emptyState} variant="info">
                {translate('results.empty-state.outdated')}
              </EmptyState>
            )}

            {!isOutdated && results.length === 0 && (
              <EmptyState className={styles.emptyState} variant="warning">
                {translate('results.empty-state.no-results')}
              </EmptyState>
            )}

            {!isOutdated && results.length > 0 && (
              isHintMode ? (
                <EmptyState className={styles.emptyState} variant="info">
                  {translate(hintMessageKey)}
                </EmptyState>
              ) : (
                <div className={styles.listContainer}>
                  <List
                    className={classNames(styles.list, {
                      [styles.outdated]: isOutdated,
                    })}
                    dir={direction}
                    listRef={listRef}
                    rowComponent={Result}
                    rowCount={results.length}
                    rowHeight={RESULTS_ITEM_HEIGHT}
                    rowProps={itemData}
                  />
                </div>
              )
            )}
          </>
        )}
      </div>

      {showInput && <ResultsInput className={styles.input} />}

      {isLoadingDebounced && <Loading />}
    </div>
  );
};
