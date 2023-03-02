import { Bonus, Cell, Tile as TileModel } from '@scrabble-solver/types';
import classNames from 'classnames';
import { CSSProperties, FunctionComponent, memo, RefObject } from 'react';

import { FlagFill, Star } from 'icons';

import Tile from '../../../Tile';

import styles from './Cell.module.scss';
import { getBonusClassname } from './lib';

interface Props {
  bonus: Bonus | undefined;
  cell: Cell;
  className?: string;
  isBottom: boolean;
  isCenter: boolean;
  isRight: boolean;
  isEmpty: boolean;
  isFiltered: boolean;
  isValid: boolean;
  points?: number;
  size: number;
  style?: CSSProperties;
  tile: TileModel;
  tileRef: RefObject<HTMLDivElement>;
}

const CellPure: FunctionComponent<Props> = ({
  bonus,
  cell,
  className,
  isBottom,
  isCenter,
  isRight,
  isEmpty,
  isFiltered,
  isValid,
  points,
  size,
  style,
  tile,
  tileRef,
}) => (
  <div
    className={classNames(styles.cell, className, getBonusClassname(cell, bonus, isCenter), {
      [styles.bottom]: isBottom,
      [styles.filtered]: isFiltered,
      [styles.right]: isRight,
    })}
    style={style}
  >
    {isCenter && isEmpty && !isFiltered && <Star className={styles.icon} />}

    {isFiltered && isEmpty && <FlagFill className={styles.icon} />}

    <Tile
      className={styles.tile}
      character={isEmpty ? undefined : tile.character}
      data-board-tile-x={cell.x}
      data-board-tile-y={cell.y}
      highlighted={cell.isCandidate()}
      isBlank={tile.isBlank}
      isValid={isValid}
      points={points}
      raised={!isEmpty}
      ref={tileRef}
      size={size}
    />
  </div>
);

export default memo(CellPure);
