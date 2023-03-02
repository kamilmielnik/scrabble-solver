import { Result } from '@scrabble-solver/types';
import classNames from 'classnames';
import { FunctionComponent, SyntheticEvent, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { useAppLayout, useIsTouchDevice } from 'hooks';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, BORDER_WIDTH, RACK_TILE_SIZE_MAX } from 'parameters';
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
import Dictionary from '../Dictionary';
import DictionaryInput from '../DictionaryInput';
import Rack from '../Rack';
import Results from '../Results';

import { EmptyState, FloatingSolveButton, ResultCandidatePicker } from './components';
import styles from './Solver.module.scss';

interface Props {
  className?: string;
  height: number;
  width: number;
  onShowResults: () => void;
}

// eslint-disable-next-line max-statements
const Solver: FunctionComponent<Props> = ({ className, height, width, onShowResults }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();
  const { componentsSpacing, isBoardFullWidth, showColumn, showCompactControls, showFloatingSolveButton } =
    useAppLayout();
  const [bottomContainerRef, { height: bottomContainerHeight }] = useMeasure<HTMLDivElement>();
  const [columnRef, { width: columnWidth }] = useMeasure<HTMLDivElement>();
  const maxBoardWidth = width - columnWidth - (showColumn ? componentsSpacing : 0) - 2 * componentsSpacing;
  const maxBoardHeight = isBoardFullWidth ? Number.POSITIVE_INFINITY : Math.max(height - bottomContainerHeight, 0);
  const config = useTypedSelector(selectConfig);
  const error = useTypedSelector(selectSolveError);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const allResults = useTypedSelector(selectSortedResults);
  const results = useTypedSelector(selectSortedFilteredResults);
  const [bestResult] = results || [];
  const cellWidth = (maxBoardWidth - (config.boardWidth + 1) * BORDER_WIDTH) / config.boardWidth;
  const cellHeight = (maxBoardHeight - (config.boardHeight + 1) * BORDER_WIDTH) / config.boardHeight;
  const cellSize = Math.min(cellWidth, cellHeight);
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = Math.min((maxBoardWidth - 2 * BORDER_WIDTH) / config.maximumCharactersCount, RACK_TILE_SIZE_MAX);
  const maxControlsWidth = tileSize * config.maximumCharactersCount + 2 * BORDER_WIDTH;
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
            <Board cellSize={cellSizeSafe} className={styles.board} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.column} ref={columnRef}>
            <Results callbacks={callbacks} />

            <div className={styles.dictionaryContainer}>
              <Dictionary className={styles.dictionary} />
              <DictionaryInput className={styles.dictionaryInput} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer} ref={bottomContainerRef}>
        <div className={styles.bottomContent}>
          <form onSubmit={handleSubmit}>
            <Rack className={styles.rack} tileSize={tileSize} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          {showCompactControls && (
            <div className={styles.controls} style={{ maxWidth: maxControlsWidth }}>
              <ResultCandidatePicker onResultClick={onShowResults} />

              {error && (
                <EmptyState className={styles.emptyState} variant="error">
                  {error.message}
                </EmptyState>
              )}

              {allResults && allResults.length === 0 && !isOutdated && (
                <EmptyState className={styles.emptyState} variant="warning">
                  {translate('results.empty-state.no-results')}
                </EmptyState>
              )}
            </div>
          )}
        </div>
      </div>

      {showFloatingSolveButton && <FloatingSolveButton className={styles.solve} onClick={handleSubmit} />}
    </div>
  );
};

export default Solver;
