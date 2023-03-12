import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import { ChangeEventHandler, FunctionComponent, RefObject, useCallback, useMemo } from 'react';

import { getTileSizes } from 'lib';
import {
  selectCellBonus,
  selectCellIsFiltered,
  selectCellIsValid,
  selectLocale,
  selectTilePoints,
  useTranslate,
  useTypedSelector,
} from 'state';

import CellPure from './CellPure';

interface Props {
  cell: CellModel;
  cellBottom?: CellModel;
  cellLeft?: CellModel;
  cellRight?: CellModel;
  cellTop?: CellModel;
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  isBottom: boolean;
  isCenter: boolean;
  isRight: boolean;
  size: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: (x: number, y: number) => void;
}

const Cell: FunctionComponent<Props> = ({
  cell,
  cellBottom,
  cellLeft,
  cellRight,
  cellTop,
  className,
  inputRef,
  isBottom,
  isCenter,
  isRight,
  size,
  onChange,
  onFocus,
}) => {
  const { tile, x, y } = cell;
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const bonus = useTypedSelector((state) => selectCellBonus(state, cell));
  const points = useTypedSelector((state) => selectTilePoints(state, cell.tile));
  const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
  const isValid = useTypedSelector((state) => selectCellIsValid(state, cell));
  const { tileFontSize } = getTileSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const style = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);

  const handleFocus = useCallback(() => onFocus(x, y), [x, y, onFocus]);

  return (
    <CellPure
      aria-label={translate('cell.tile.location', {
        x: (x + 1).toLocaleString(locale),
        y: (y + 1).toLocaleString(locale),
      })}
      bonus={bonus}
      cell={cell}
      cellBottom={cellBottom}
      cellLeft={cellLeft}
      cellRight={cellRight}
      cellTop={cellTop}
      className={className}
      inputRef={inputRef}
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
      onChange={onChange}
      onFocus={handleFocus}
    />
  );
};

export default Cell;
