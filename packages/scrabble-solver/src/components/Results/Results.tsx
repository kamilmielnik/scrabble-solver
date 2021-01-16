import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { FixedSizeList } from 'react-window';

import { lightning } from 'icons';
import { selectIsLoading, selectSortedResults, solveSlice, useTranslate, useTypedSelector } from 'state';

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
  const isOutdated = true; // TODO
  const hasInput = true;

  const handleRefresh = () => {
    dispatch(solveSlice.actions.submit());
  };

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
            <EmptyState type="warning">{translate('results.empty-state.no-results')}</EmptyState>
          )}
        </>
      )}

      <button
        className={styles.outdatedButton}
        disabled={isLoading || !isOutdated || !hasInput}
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
