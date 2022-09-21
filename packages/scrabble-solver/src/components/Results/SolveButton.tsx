import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { Play } from 'icons';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectRack,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../Button';

import styles from './Results.module.scss';

const SolveButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectIsLoading);
  const rack = useTypedSelector(selectRack);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const hasTiles = rack.some((tile) => tile !== null);

  const handleRefresh = () => {
    dispatch(solveSlice.actions.submit());
  };

  return (
    <Button
      className={styles.outdatedButton}
      disabled={isLoading || !isOutdated || !hasTiles}
      Icon={Play}
      type="submit"
      onClick={handleRefresh}
    >
      {translate('results.solve')}
    </Button>
  );
};

export default SolveButton;
