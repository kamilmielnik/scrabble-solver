import classNames from 'classnames';
import { FunctionComponent, useLayoutEffect, useRef } from 'react';
import { FixedSizeList } from 'react-window';

import { LOCALE_FEATURES } from 'i18n';
import { RESULTS_HEADER_HEIGHT, RESULTS_INPUT_HEIGHT, RESULTS_ITEM_HEIGHT } from 'parameters';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectLocale,
  selectSolveError,
  selectSortedFilteredResults,
  selectSortedResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';
import ResultsInput from '../ResultsInput';

import getColumns from './getColumns';
import HeaderButton from './HeaderButton';
import Result from './Result';
import styles from './Results.module.scss';
import SolveButton from './SolveButton';

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const locale = useTypedSelector(selectLocale);
  const translate = useTranslate();
  const allResults = useTypedSelector(selectSortedResults);
  const results = useTypedSelector(selectSortedFilteredResults);
  const isLoading = useTypedSelector(selectIsLoading);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const error = useTypedSelector(selectSolveError);
  const listRef = useRef<HTMLElement>();
  const columns = getColumns(LOCALE_FEATURES[locale]);

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0, 0);
    }
  }, [listRef, results]);

  return (
    <div className={styles.results}>
      <div className={styles.header}>
        {columns.map((column) => (
          <HeaderButton column={column} key={column.id} />
        ))}
      </div>

      {typeof error !== 'undefined' && (
        <EmptyState className={styles.emptyState} type="error">
          {error.message}
        </EmptyState>
      )}

      {typeof results === 'undefined' && typeof error === 'undefined' && (
        <EmptyState className={styles.emptyState} type="info">
          {translate('results.empty-state.uninitialized')}

          <SolveButton />
        </EmptyState>
      )}

      {typeof results !== 'undefined' && typeof allResults !== 'undefined' && typeof error === 'undefined' && (
        <>
          {isOutdated && (
            <EmptyState className={styles.emptyState} type="info">
              {translate('results.empty-state.outdated')}

              <SolveButton />
            </EmptyState>
          )}

          {!isOutdated && (
            <>
              {allResults.length === 0 && (
                <EmptyState className={styles.emptyState} type="warning">
                  {translate('results.empty-state.no-results')}
                </EmptyState>
              )}

              {allResults.length > 0 && results.length === 0 && (
                <EmptyState className={styles.emptyState} type="info">
                  {translate('results.empty-state.no-filtered-results')}
                </EmptyState>
              )}

              {allResults.length > 0 && results.length > 0 && (
                <FixedSizeList
                  className={classNames(styles.list, {
                    [styles.outdated]: isOutdated,
                  })}
                  height={height - RESULTS_HEADER_HEIGHT - RESULTS_INPUT_HEIGHT}
                  innerRef={listRef}
                  itemCount={results.length}
                  itemSize={RESULTS_ITEM_HEIGHT}
                  width={width}
                >
                  {Result}
                </FixedSizeList>
              )}

              {allResults.length > 0 && <ResultsInput className={styles.input} />}
            </>
          )}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default Results;
