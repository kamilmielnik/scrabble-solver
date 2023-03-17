import { Result } from '@scrabble-solver/types';
import classNames from 'classnames';
import { FunctionComponent, memo, SyntheticEvent, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppLayout, useIsTouchDevice } from 'hooks';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectResultCandidate,
  selectResults,
  selectSolveError,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Alert from '../Alert';
import Board from '../Board';
import Dictionary from '../Dictionary';
import DictionaryInput from '../DictionaryInput';
import Rack from '../Rack';
import Results from '../Results';

import { FloatingSolveButton, ResultCandidatePicker } from './components';
import styles from './Solver.module.scss';

interface Props {
  className?: string;
  onShowResults: () => void;
}

const Solver: FunctionComponent<Props> = ({ className, onShowResults }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();
  const { cellSize, maxControlsWidth, showCompactControls, showFloatingSolveButton, tileSize } = useAppLayout();
  const error = useTypedSelector(selectSolveError);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const results = useTypedSelector(selectResults);
  const [bestResult] = results || [];
  const touchCallbacks = useMemo(
    () => ({
      onClick: (result: Result) => {
        const isSelected = result === resultCandidate;

        if (isSelected) {
          dispatch(resultsSlice.actions.applyResult(result));
        } else {
          dispatch(resultsSlice.actions.changeResultCandidate(result));
        }
      },
    }),
    [dispatch, resultCandidate],
  );
  const mouseCallbacks = useMemo(
    () => ({
      onBlur: () => {
        dispatch(resultsSlice.actions.changeResultCandidate(null));
      },
      onClick: (result: Result) => {
        dispatch(resultsSlice.actions.applyResult(result));
      },
      onFocus: (result: Result) => {
        dispatch(resultsSlice.actions.changeResultCandidate(result));
      },
      onMouseEnter: (result: Result) => {
        dispatch(resultsSlice.actions.changeResultCandidate(result));
      },
      onMouseLeave: () => {
        dispatch(resultsSlice.actions.changeResultCandidate(null));
      },
    }),
    [dispatch],
  );
  const callbacks = isTouchDevice ? touchCallbacks : mouseCallbacks;

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    dispatch(solveSlice.actions.submit());
  };

  useEffect(() => {
    if (showCompactControls && bestResult && !isOutdated) {
      dispatch(resultsSlice.actions.changeResultCandidate(bestResult));
    }
  }, [bestResult, dispatch, showCompactControls, isOutdated]);

  return (
    <div className={classNames(styles.solver, className)}>
      <div className={styles.container}>
        <div className={styles.content}>
          <form className={styles.boardContainer} onSubmit={handleSubmit}>
            <Board cellSize={cellSize} className={styles.board} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.column}>
            <Results callbacks={callbacks} className={styles.results} />

            <div className={styles.dictionaryContainer}>
              <Dictionary className={styles.dictionary} />
              <DictionaryInput className={styles.dictionaryInput} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.bottomContent}>
          <form onSubmit={handleSubmit}>
            <Rack className={styles.rack} tileSize={tileSize} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          {showCompactControls && (
            <div className={styles.controls} style={{ maxWidth: maxControlsWidth }}>
              <ResultCandidatePicker onResultClick={onShowResults} />

              {error && (
                <Alert className={styles.emptyState} variant="error">
                  {error.message}
                </Alert>
              )}

              {results && results.length === 0 && !isOutdated && (
                <Alert className={styles.emptyState} variant="warning">
                  {translate('results.empty-state.no-results')}
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>

      {showFloatingSolveButton && <FloatingSolveButton className={styles.solve} onClick={handleSubmit} />}
    </div>
  );
};

export default memo(Solver);
