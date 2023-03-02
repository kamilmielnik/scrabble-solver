import { Cell as CellModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import { forwardRef, memo, RefObject } from 'react';

import styles from './Board.module.scss';
import { Cell } from './components';

interface Props {
  className?: string;
  cellSize: number;
  center: CellModel;
  rows: CellModel[][];
  tileRefs: RefObject<HTMLDivElement>[][];
}

const BoardPure = forwardRef<HTMLDivElement, Props>(({ className, cellSize, center, rows, tileRefs }, ref) => (
  <div className={classNames(styles.board, className)} ref={ref}>
    {rows.map((cells, y) => (
      <div className={styles.row} key={y}>
        {cells.map((cell, x) => (
          <Cell
            className={styles.cell}
            cell={cell}
            isBottom={y === rows.length - 1}
            isCenter={center.x === x && center.y === y}
            isRight={x === cells.length - 1}
            key={x}
            size={cellSize}
            tileRef={tileRefs[y][x]}
          />
        ))}
      </div>
    ))}
  </div>
));

export default memo(BoardPure);
