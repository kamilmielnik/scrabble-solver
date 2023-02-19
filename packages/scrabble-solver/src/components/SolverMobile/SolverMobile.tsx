import classNames from 'classnames';
import { FormEvent, FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { Check, Search } from 'icons';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, RACK_TILE_SIZE_MAX } from 'parameters';
import {
  resultsSlice,
  selectAreResultsOutdated,
  selectConfig,
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

import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
  onShowResults: () => void;
}

const SolverMobile: FunctionComponent<Props> = ({ className, onShowResults }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const allResults = useTypedSelector(selectSortedResults);
  const error = useTypedSelector(selectSolveError);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,
  const results = useTypedSelector(selectSortedFilteredResults)!;
  const [bestResult] = results || [];
  const cellSize = (sizerWidth - (config.boardWidth + 1)) / config.boardWidth;
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = sizerWidth / config.maximumCharactersCount;

  const handleApply = () => {
    if (resultCandidate) {
      dispatch(resultsSlice.actions.applyResult(resultCandidate));
    }
  };

  const handleSolve = () => {
    dispatch(solveSlice.actions.submit());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            <Rack className={styles.rack} tileSize={Math.min(tileSize, RACK_TILE_SIZE_MAX)} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.controls}>
            {resultCandidate && (
              <ResultCandidatePicker
                className={styles.resultCandidatePicker}
                disabled={isOutdated}
                points={resultCandidate.points}
                word={resultCandidate.word}
                onClick={onShowResults}
              />
            )}

            {!resultCandidate && (
              <div className={styles.emptyState} onClick={onShowResults}>
                {typeof error !== 'undefined' && <>{error.message}</>}

                {typeof error === 'undefined' && typeof results === 'undefined' && (
                  <>{translate('results.empty-state.uninitialized')}</>
                )}

                {typeof error === 'undefined' &&
                  typeof results !== 'undefined' &&
                  typeof allResults !== 'undefined' && (
                    <>
                      {isOutdated && <>{translate('results.empty-state.outdated')}</>}

                      {!isOutdated && allResults.length === 0 && <>{translate('results.empty-state.no-results')}</>}
                    </>
                  )}
              </div>
            )}

            {isOutdated && (
              <button className={styles.submit} onClick={handleSolve}>
                <Search className={styles.submitIcon} />
              </button>
            )}

            {!isOutdated && (
              <button className={styles.submit} disabled={!resultCandidate} onClick={handleApply}>
                <Check className={classNames(styles.submitIcon, styles.check)} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolverMobile;
