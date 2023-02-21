import { Result } from '@scrabble-solver/types';
import classNames from 'classnames';
import { FormEvent, FunctionComponent, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { useIsTouchDevice, useMediaQuery } from 'hooks';
import {
  BOARD_TILE_SIZE_MAX,
  BOARD_TILE_SIZE_MIN,
  BORDER_WIDTH,
  COLUMN_MIN_HEIGHT,
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_SMALL,
  DICTIONARY_HEIGHT,
  RACK_TILE_SIZE_MAX,
} from 'parameters';
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
import ResultCandidatePicker from '../ResultCandidatePicker';
import Results from '../Results';
import Well from '../Well';

import { ApplyButton, EmptyState, SolveButton } from './components';
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
  const [bottomContainerRef, { height: bottomContainerHeight }] = useMeasure<HTMLDivElement>();
  const [resultsContainerRef, { width: resultsContainerWidth }] = useMeasure<HTMLDivElement>();
  const isSmallSpacing = useMediaQuery('<xl');
  const showControls = useMediaQuery('<l');
  const showColumn = useMediaQuery('>=l');
  const componentsSpacing = isSmallSpacing ? COMPONENTS_SPACING_SMALL : COMPONENTS_SPACING;
  const maxBoardWidth = width - resultsContainerWidth - (showColumn ? componentsSpacing : 0) - 2 * componentsSpacing;
  const maxBoardHeight = Math.max(height - bottomContainerHeight, showColumn ? COLUMN_MIN_HEIGHT : 0);
  const config = useTypedSelector(selectConfig);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const allResults = useTypedSelector(selectSortedResults);
  const error = useTypedSelector(selectSolveError);
  const results = useTypedSelector(selectSortedFilteredResults);
  const [bestResult] = results || [];
  const cellWidth = (maxBoardWidth - (config.boardWidth + 1) * BORDER_WIDTH) / config.boardWidth;
  const cellHeight = (maxBoardHeight - (config.boardHeight + 1) * BORDER_WIDTH) / config.boardHeight;
  const cellSize = Math.min(cellWidth, cellHeight);
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = Math.min((maxBoardWidth - 2 * BORDER_WIDTH) / config.maximumCharactersCount, RACK_TILE_SIZE_MAX);
  const boardSize = (cellSizeSafe + BORDER_WIDTH) * Math.max(config.boardWidth, config.boardHeight) + BORDER_WIDTH;
  const resultsHeight = boardSize - DICTIONARY_HEIGHT - componentsSpacing - 4 * BORDER_WIDTH;
  const maxControlsWidth = tileSize * config.maximumCharactersCount + 2 * BORDER_WIDTH;
  const showApplyButton = allResults && allResults.length > 0 && !isOutdated;
  const showSolveButton = isTouchDevice && !showApplyButton;
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
    <div className={classNames(styles.solver, className)}>
      <div className={styles.container}>
        <div className={styles.content}>
          <form className={styles.boardContainer} onSubmit={handleSubmit}>
            <Board cellSize={cellSizeSafe} className={styles.board} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.column}>
            <Well className={styles.resultsContainer} ref={resultsContainerRef}>
              {resultsContainerWidth > 0 && resultsHeight > 0 && (
                <Results callbacks={callbacks} height={resultsHeight} width={resultsContainerWidth} />
              )}
            </Well>

            <Well>
              <div className={styles.dictionary} style={{ height: DICTIONARY_HEIGHT }}>
                <Dictionary className={styles.dictionaryOutput} />
                <DictionaryInput className={styles.dictionaryInput} />
              </div>
            </Well>
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer} ref={bottomContainerRef}>
        <div className={styles.bottomContent}>
          <form className={styles.rackContainer} onSubmit={handleSubmit}>
            <Rack className={styles.rack} tileSize={tileSize} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          {showControls && (
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
                        <ResultCandidatePicker className={styles.resultCandidatePicker} onClick={onShowResults} />
                      )}
                    </>
                  )}
                </>
              )}

              {showApplyButton && <ApplyButton className={classNames(styles.submit, styles.apply)} />}
            </div>
          )}
        </div>
      </div>

      {showSolveButton && <SolveButton className={styles.solve} onClick={onShowResults} />}
    </div>
  );
};

export default Solver;
