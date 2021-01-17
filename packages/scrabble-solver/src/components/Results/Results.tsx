import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { FixedSizeList } from 'react-window';

import { lightning } from 'icons';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectSortedResults,
  selectTiles,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import EmptyState from '../EmptyState';
import Loading from '../Loading';
import SvgIcon from '../SvgIcon';

import Header from './Header';
import Result from './Result';
import styles from './Results.module.scss';

const HEADER_HEIGHT = 35;
const ITEM_HEIGHT = 34;
const OUTDATED_HEIGHT = 44;

interface Props {
  height: number;
  width: number;
}

const Results: FunctionComponent<Props> = ({ height, width }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const results = useTypedSelector(selectSortedResults);
  const isLoading = useTypedSelector(selectIsLoading);
  const tiles = useTypedSelector(selectTiles);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const hasTiles = tiles.some((tile) => tile !== null);

  const handleRefresh = () => {
    dispatch(solveSlice.actions.submit());
  };

  return (
    <div className={styles.results}>
      <Header />

      {typeof results === 'undefined' && (
        <EmptyState className={styles.emptyState} type="info">
          {translate('results.empty-state.unitialized')}
        </EmptyState>
      )}

      {typeof results !== 'undefined' && (
        <>
          {isOutdated && (
            <EmptyState className={styles.emptyState} type="info">
              {translate('results.empty-state.outdated')}
            </EmptyState>
          )}

          {!isOutdated && (
            <>
              {results.length > 0 && (
                <FixedSizeList
                  className={classNames(styles.list, {
                    [styles.outdated]: isOutdated,
                  })}
                  height={height - HEADER_HEIGHT - OUTDATED_HEIGHT}
                  itemCount={results.length}
                  itemSize={ITEM_HEIGHT}
                  width={width}
                >
                  {Result}
                </FixedSizeList>
              )}

              {results.length === 0 && (
                <EmptyState className={styles.emptyState} type="warning">
                  {translate('results.empty-state.no-results')}
                </EmptyState>
              )}
            </>
          )}
        </>
      )}

      <button
        className={styles.outdatedButton}
        disabled={isLoading || !isOutdated || !hasTiles}
        type="button"
        onClick={handleRefresh}
      >
        <SvgIcon className={styles.outdatedIcon} icon={lightning} />
        <span className={styles.outdatedLabel}>Solve</span>
      </button>

      {isLoading && <Loading />}
    </div>
  );
};

export default Results;
