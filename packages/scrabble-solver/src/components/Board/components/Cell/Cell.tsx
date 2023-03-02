import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import { FunctionComponent, RefObject, useMemo } from 'react';

import { getTileSizes } from 'lib';
import { selectCellBonus, selectCellIsFiltered, selectCellIsValid, selectTilePoints, useTypedSelector } from 'state';

import CellPure from './CellPure';

interface Props {
  cell: CellModel;
  className?: string;
  isBottom: boolean;
  isCenter: boolean;
  isRight: boolean;
  size: number;
  tileRef: RefObject<HTMLDivElement>;
}

const Cell: FunctionComponent<Props> = ({ cell, className, isBottom, isCenter, isRight, size, tileRef }) => {
  const { tile } = cell;
  const bonus = useTypedSelector((state) => selectCellBonus(state, cell));
  const points = useTypedSelector((state) => selectTilePoints(state, cell.tile));
  const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
  const isValid = useTypedSelector((state) => selectCellIsValid(state, cell));
  const { tileFontSize } = getTileSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const style = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);

  return (
    <CellPure
      bonus={bonus}
      cell={cell}
      className={className}
      isBottom={isBottom}
      isCenter={isCenter}
      isRight={isRight}
      isEmpty={isEmpty}
      isFiltered={isFiltered}
      isValid={isValid}
      points={points}
      size={size}
      style={style}
      tile={tile}
      tileRef={tileRef}
    />
  );
};

export default Cell;
