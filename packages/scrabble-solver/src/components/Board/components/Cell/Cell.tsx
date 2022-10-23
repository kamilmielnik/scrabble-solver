import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import { ChangeEventHandler, FunctionComponent, RefObject, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { getTileSizes } from 'lib';
import {
  boardSlice,
  cellFilterSlice,
  selectCellBonus,
  selectCellIsFiltered,
  selectTilePoints,
  useTranslate,
  useTypedSelector,
} from 'state';

import CellPure from './CellPure';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef: RefObject<HTMLInputElement>;
  isCenter: boolean;
  size: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
}

const Cell: FunctionComponent<Props> = ({
  cell,
  className,
  direction,
  inputRef,
  isCenter,
  size,
  onChange,
  onDirectionToggle,
  onFocus,
}) => {
  const { tile, x, y } = cell;
  const dispatch = useDispatch();
  const translate = useTranslate();
  const bonus = useTypedSelector((state) => selectCellBonus(state, cell));
  const points = useTypedSelector((state) => selectTilePoints(state, cell.tile));
  const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
  const { tileFontSize } = getTileSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const style = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);

  const handleDirectionToggleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    onDirectionToggle();
  }, [onDirectionToggle]);

  const handleFocus = useCallback(() => onFocus(x, y), [x, y, onFocus]);

  const handleToggleBlankClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    dispatch(boardSlice.actions.toggleCellIsBlank({ x, y }));
  }, [dispatch, x, y]);

  const handleToggleFilterCellClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    dispatch(cellFilterSlice.actions.toggle({ x, y }));
  }, [dispatch, x, y]);

  return (
    <CellPure
      bonus={bonus}
      cell={cell}
      className={className}
      direction={direction}
      inputRef={inputRef}
      isCenter={isCenter}
      isEmpty={isEmpty}
      isFiltered={isFiltered}
      points={points}
      size={size}
      style={style}
      tile={tile}
      translate={translate}
      onChange={onChange}
      onDirectionToggleClick={handleDirectionToggleClick}
      onFocus={handleFocus}
      onToggleBlankClick={handleToggleBlankClick}
      onToggleFilterCellClick={handleToggleFilterCellClick}
    />
  );
};

export default Cell;
