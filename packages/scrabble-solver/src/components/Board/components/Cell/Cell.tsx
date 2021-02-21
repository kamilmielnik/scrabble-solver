import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell as CellModel } from '@scrabble-solver/types';
import React, { FunctionComponent, RefObject, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { getTileSizes } from 'lib';
import { boardSlice, selectCellBonus, selectTilePoints, useTranslate, useTypedSelector } from 'state';

import CellPure from './CellPure';

interface Props {
  cell: CellModel;
  className?: string;
  direction: 'horizontal' | 'vertical';
  inputRef: RefObject<HTMLInputElement>;
  size: number;
  onDirectionToggle: () => void;
  onFocus: (x: number, y: number) => void;
}

const Cell: FunctionComponent<Props> = ({ cell, className, direction, inputRef, size, onDirectionToggle, onFocus }) => {
  const { tile, x, y } = cell;
  const dispatch = useDispatch();
  const translate = useTranslate();
  const bonus = useTypedSelector((state) => selectCellBonus(state, cell));
  const points = useTypedSelector((state) => selectTilePoints(state, cell.tile));
  const { tileFontSize } = getTileSizes(size);
  const isEmpty = tile.character === EMPTY_CELL;
  const style = useMemo(() => ({ fontSize: tileFontSize }), [tileFontSize]);

  const handleFocus = useCallback(() => onFocus(x, y), [x, y, onFocus]);

  const handleToggleBlankClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    dispatch(boardSlice.actions.toggleCellIsBlank({ x, y }));
  }, [dispatch, x, y]);

  const handleDirectionToggleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    onDirectionToggle();
  }, [onDirectionToggle]);

  return (
    <CellPure
      bonus={bonus}
      cell={cell}
      className={className}
      direction={direction}
      inputRef={inputRef}
      isEmpty={isEmpty}
      points={points}
      size={size}
      style={style}
      tile={tile}
      translate={translate}
      onDirectionToggleClick={handleDirectionToggleClick}
      onFocus={handleFocus}
      onToggleBlankClick={handleToggleBlankClick}
    />
  );
};

export default Cell;
