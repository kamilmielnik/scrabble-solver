import classNames from 'classnames';
import { FormEvent, FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { Check, Search } from 'icons';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, BORDER_WIDTH, RACK_TILE_SIZE_MAX } from 'parameters';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectConfig,
  selectIsLoading,
  selectRack,
  selectResultCandidate,
  selectSolveError,
  selectSortedFilteredResults,
  selectSortedResults,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Board from '../Board';
import Rack from '../Rack';
import ResultCandidatePicker from '../ResultCandidatePicker';

import { EmptyState } from './components';
import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
  onShowResults: () => void;
}

// eslint-disable-next-line max-statements
const SolverMobile: FunctionComponent<Props> = ({ className, onShowResults }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const isLoading = useTypedSelector(selectIsLoading);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const rack = useTypedSelector(selectRack);
  const hasTiles = rack.some((tile) => tile !== null);
  const allResults = useTypedSelector(selectSortedResults);
  const error = useTypedSelector(selectSolveError);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,
  const results = useTypedSelector(selectSortedFilteredResults)!;
  const [bestResult] = results || [];
  const cellSize = (sizerWidth - (config.boardWidth + 1)) / config.boardWidth;
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = Math.min((sizerWidth - 2 * BORDER_WIDTH) / config.maximumCharactersCount, RACK_TILE_SIZE_MAX);
  const maxControlsWidth = tileSize * config.maximumCharactersCount + 2 * BORDER_WIDTH;
  const showApplyButton = allResults && allResults.length > 0 && !isOutdated;

  const handleApply = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }
  };

  const handleSolve = () => {
    onShowResults();
    dispatch(solveSlice.actions.submit());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onShowResults();
    dispatch(solveSlice.actions.submit());
  };

  useEffect(() => {
    if (bestResult) {
      dispatch(resultsSlice.actions.changeResultCandidate(bestResult));
    }
  }, [bestResult, dispatch]);

  return (
    <div className={classNames(styles.solverMobile, className)}>
      <div className={styles.sizer} ref={sizerRef} />

      <form className={styles.boardContainer} onSubmit={handleSubmit}>
        <Board className={styles.board} cellSize={cellSizeSafe} />
        <input className={styles.submitInput} tabIndex={-1} type="submit" />
      </form>

      <div className={styles.bottomContainer}>
        <div className={styles.bottomContent}>
          <form className={styles.rackContainer} onSubmit={handleSubmit}>
            <Rack className={styles.rack} tileSize={tileSize} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.controls} style={{ maxWidth: maxControlsWidth }}>
            {typeof error !== 'undefined' && (
              <EmptyState variant="error" onClick={onShowResults}>
                {error.message}
              </EmptyState>
            )}

            {typeof error === 'undefined' && typeof results === 'undefined' && (
              <EmptyState variant="info" onClick={onShowResults}>
                {translate('results.empty-state.uninitialized')}
              </EmptyState>
            )}

            {typeof error === 'undefined' && typeof results !== 'undefined' && typeof allResults !== 'undefined' && (
              <>
                {isOutdated && (
                  <EmptyState variant="info" onClick={onShowResults}>
                    {translate('results.empty-state.outdated')}
                  </EmptyState>
                )}

                {!isOutdated && (
                  <>
                    {allResults.length === 0 && (
                      <EmptyState variant="warning" onClick={onShowResults}>
                        {translate('results.empty-state.no-results')}
                      </EmptyState>
                    )}

                    {allResults.length > 0 && resultCandidate && (
                      <ResultCandidatePicker
                        className={styles.resultCandidatePicker}
                        disabled={isOutdated}
                        points={resultCandidate.points}
                        word={resultCandidate.word}
                        onClick={onShowResults}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {showApplyButton && (
              <button
                className={classNames(styles.submit, styles.apply)}
                disabled={!resultCandidate}
                onClick={handleApply}
              >
                <Check className={classNames(styles.submitIcon, styles.applyIcon)} />
              </button>
            )}
          </div>
        </div>
      </div>

      {!showApplyButton && (
        <button
          className={classNames(styles.submit, styles.search)}
          disabled={isLoading || !isOutdated || !hasTiles}
          onClick={handleSolve}
        >
          <Search className={styles.submitIcon} />
        </button>
      )}
    </div>
  );
};

export default SolverMobile;
