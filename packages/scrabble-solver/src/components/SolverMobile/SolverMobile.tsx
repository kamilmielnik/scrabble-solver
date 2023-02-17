import classNames from 'classnames';
import { FormEvent, FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { CheckLarge } from 'icons';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, RACK_TILE_SIZE_MAX } from 'parameters';
import {
  resultsSlice,
  selectConfig,
  selectResultCandidate,
  selectSortedFilteredResults,
  solveSlice,
  useTypedSelector,
} from 'state';

import Board from '../Board';
import Rack from '../Rack';
import ResultCandidatePicker from '../ResultCandidatePicker';

import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
}

const SolverMobile: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const resultCandidate = useTypedSelector(selectResultCandidate);
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

  const handlePick = () => {};

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

      <Board className={styles.board} cellSize={cellSizeSafe} />

      <div className={styles.bottomContainer}>
        <div className={styles.bottomContent}>
          <form className={styles.rackContainer} onSubmit={handleSubmit}>
            <Rack className={styles.rack} tileSize={Math.min(tileSize, RACK_TILE_SIZE_MAX)} />
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.controls}>
            <ResultCandidatePicker className={styles.resultCandidatePicker} onClick={handlePick} />

            <button className={styles.apply} disabled={!resultCandidate} onClick={handleApply}>
              <CheckLarge className={styles.applyIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolverMobile;
