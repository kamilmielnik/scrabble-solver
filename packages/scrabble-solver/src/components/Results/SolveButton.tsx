import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { play } from 'icons';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectTiles,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import SvgIcon from '../SvgIcon';

import styles from './Results.module.scss';

const SolveButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectIsLoading);
  const tiles = useTypedSelector(selectTiles);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const hasTiles = tiles.some((tile) => tile !== null);

  const handleRefresh = () => {
    dispatch(solveSlice.actions.submit());
  };

  return (
    <button
      className={styles.outdatedButton}
      disabled={isLoading || !isOutdated || !hasTiles}
      title={translate('results.solve')}
      type="button"
      onClick={handleRefresh}
    >
      <span className={styles.outdatedButtonContent}>
        <span className={styles.outdatedButtonLabel}>{translate('results.solve')}</span>

        <SvgIcon className={styles.outdatedButtonIcon} icon={play} />
      </span>
    </button>
  );
};

export default SolveButton;
