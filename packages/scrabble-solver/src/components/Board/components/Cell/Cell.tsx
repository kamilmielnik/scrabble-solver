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
  selectCellIsValid,
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
  isBottom: boolean;
  isCenter: boolean;
  isRight: boolean;
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
  isBottom,
  isCenter,
  isEdge,
  isRight,
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
  const isValid = useTypedSelector((state) => selectCellIsValid(state, cell));
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
