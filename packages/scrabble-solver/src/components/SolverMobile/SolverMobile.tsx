import classNames from 'classnames';
import { FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN } from 'parameters';
import { selectConfig, solveSlice, useTypedSelector } from 'state';

import Board from '../Board';
import Rack from '../Rack';

import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
}

const SolverMobile: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = Math.floor((sizerWidth - (config.boardWidth + 1)) / config.boardWidth);
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = Math.floor((sizerWidth - (config.maximumCharactersCount + 1)) / config.maximumCharactersCount);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  return (
    <div className={classNames(styles.solverMobile, className)}>
      <div className={styles.sizer} ref={sizerRef} />

      <div className={styles.boardContainer}>
        <Board className={styles.board} cellSize={cellSizeSafe} />
      </div>

      <form className={styles.rackContainer} onSubmit={handleSubmit}>
        <Rack className={styles.rack} tileSize={tileSize} />
        <input className={styles.submitInput} tabIndex={-1} type="submit" />
      </form>
    </div>
  );
};

export default SolverMobile;
