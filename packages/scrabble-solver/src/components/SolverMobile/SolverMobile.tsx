import classNames from 'classnames';
import { FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { Eraser } from 'icons';
import { BOARD_TILE_SIZE_MAX, BOARD_TILE_SIZE_MIN, RACK_TILE_SIZE_MAX } from 'parameters';
import { reset, selectConfig, solveSlice, useTranslate, useTypedSelector } from 'state';

import Board from '../Board';
import Rack from '../Rack';
import SolveButton from '../Results/SolveButton';
import SquareButton from '../SquareButton';

import styles from './SolverMobile.module.scss';

interface Props {
  className?: string;
}

const SolverMobile: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [sizerRef, { width: sizerWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = (sizerWidth - (config.boardWidth + 1)) / config.boardWidth;
  const cellSizeSafe = Math.min(Math.max(cellSize, BOARD_TILE_SIZE_MIN), BOARD_TILE_SIZE_MAX);
  const tileSize = sizerWidth / config.maximumCharactersCount;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  const handleClear = () => {
    dispatch(reset());
  };

  return (
    <div className={classNames(styles.solverMobile, className)}>
      <div className={styles.sizer} ref={sizerRef} />

      <div className={styles.boardContainer}>
        <Board className={styles.board} cellSize={cellSizeSafe} />
      </div>

      <form className={styles.rackContainer} onSubmit={handleSubmit}>
        <Rack className={styles.rack} tileSize={Math.min(tileSize, RACK_TILE_SIZE_MAX)} />
        <input className={styles.submitInput} tabIndex={-1} type="submit" />
      </form>

      <div className={styles.controls}>
        <SquareButton
          className={styles.button}
          Icon={Eraser}
          tooltip={translate('common.clear')}
          onClick={handleClear}
        />

        <SolveButton />
      </div>
    </div>
  );
};

export default SolverMobile;
