import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { useMeasure } from 'react-use';

import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN } from 'parameters';
import { selectConfig, useTypedSelector } from 'state';

import Board from '../Board';

import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
}

const SolverMobile: FunctionComponent<Props> = ({ className }) => {
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = Math.floor((sizerWidth - (config.boardWidth + 1)) / config.boardWidth);
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);

  return (
    <div className={classNames(styles.solverMobile, className)}>
      <div className={styles.sizer} ref={sizerRef} />

      <div className={styles.boardContainer}>
        <Board className={styles.board} cellSize={cellSizeSafe} />
      </div>
    </div>
  );
};

export default SolverMobile;
