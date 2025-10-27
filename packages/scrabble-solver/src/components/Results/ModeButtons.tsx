import classNames from 'classnames';
import { type FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  selectAreResultsOutdated,
  selectProcessedResults,
  selectResultsDisplayMode,
  selectSolveIsLoading,
  selectRack,
  resultsSlice,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import { Button } from '../Button';

import styles from './Results.module.scss';

type DisplayMode = 'normal' | 'shortHint' | 'longHint';

interface Props {
  className?: string;
}

export const ModeButtons: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectSolveIsLoading);
  const rack = useTypedSelector(selectRack);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const displayMode = useTypedSelector(selectResultsDisplayMode);
  const results = useTypedSelector(selectProcessedResults);
  const hasTiles = rack.some((tile) => tile !== null);
  const hasResults = useMemo(() => Array.isArray(results) && results.length > 0, [results]);
  const shouldSolve = !hasResults || isOutdated;
  const canAttemptSolve = hasTiles && !isLoading;

  const setMode = (mode: DisplayMode) => {
    if (displayMode !== mode) {
      dispatch(resultsSlice.actions.setDisplayMode(mode));
    }

    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  const triggerSolve = () => {
    if (!canAttemptSolve) {
      return;
    }

    dispatch(solveSlice.actions.submit());
  };

  const handleModeClick = (mode: DisplayMode) => () => {
    if (isLoading) {
      return;
    }

    setMode(mode);

    if (shouldSolve) {
      triggerSolve();
    }
  };

  const buttons = useMemo(
    () =>
      [
        { mode: 'normal' as DisplayMode, label: translate('results.solve'), variant: 'primary' as const },
        { mode: 'shortHint' as DisplayMode, label: translate('results.shortHint') },
        { mode: 'longHint' as DisplayMode, label: translate('results.longHint') },
      ],
    [translate],
  );

  const isDisabled = isLoading || !hasTiles;

  return (
    <div className={classNames(styles.modeButtons, className)}>
      {buttons.map(({ mode, label, variant }) => (
        <Button
          key={mode}
          aria-label={label}
          aria-pressed={displayMode === mode}
          className={classNames(styles.modeButton, {
            [styles.modeButtonActive]: displayMode === mode,
          })}
          disabled={isDisabled}
          type="button"
          variant={variant}
          onClick={handleModeClick(mode)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
